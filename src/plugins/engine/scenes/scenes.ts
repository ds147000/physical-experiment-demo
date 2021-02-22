import { StackItem } from "../stack/stack"
import { SchedulerController } from '../scheduler'

interface Point {
    readonly x: number
    readonly y: number
}

interface Rect {
    readonly x: number
    readonly y: number
    readonly width?: number
    readonly height?: number
    readonly radius?: number
}

class Scenes {
    public Canvas: HTMLCanvasElement | null = null
    public Content: CanvasRenderingContext2D | null = null
    public scale = 1
    private materialCache: Record<string, ImageBitmap> = {}

    init(Canvas: HTMLCanvasElement): void {
        if (Canvas.tagName !== 'CANVAS') return

        this.Content = Canvas.getContext('2d')
        this.Canvas = Canvas
    }

    /**
     * 测量坐标是否在画布内
     * @param x
     * @param y
     */
    inViewBox(x: number, y: number): boolean {

        if (this.Canvas === null) return false

        const width = this.Canvas.width
        const height = this.Canvas.height
        const offsetLeft = this.Canvas.offsetLeft
        const offsetTop = this.Canvas.offsetTop

        return this.inBox({ x, y }, { x: offsetLeft, y: offsetTop, width, height })
    }

    /**
     * 测量是否在正方形区域内
     * @param point
     * @param rect
     */
    inBox(point: Point, rect: Rect): boolean {
        const { x, y } = point
        if (rect.radius !== undefined)
            return Math.abs(x - rect.x) < rect.radius && Math.abs(y - rect.y) < rect.radius

        else if (rect.width !== undefined && rect.height !== undefined) {
            const inX = rect.x <= x && x <= (rect.x + rect.width)
            const inY = rect.y <= y && y <= (rect.y + rect.height)

            return inX && inY
        }
        return false
    }

    /**
     * 测量坐标是否在多边形区域内
     * @param point
     * @param vert
     */
    inVertBox(point: Point, vert: Point[]): boolean {
        const xPoint = vert.map(item => item.x)
        const yPoint = vert.map(item => item.y)
        const minX = Math.min.apply(null, xPoint)
        const maxX = Math.max.apply(null, xPoint)
        const minY = Math.min.apply(null, yPoint)
        const maxY = Math.max.apply(null, yPoint)

        if (!(minX <= point.x && maxX >= point.x && minY <= point.y && maxY >= point.y))
            return false
        return this.inPtInPoly(point, vert)
    }

    /**
     * 坐标是否在多边形内
     * @param point
     * @param APoints
     */
    inPtInPoly(point: Point, APoints: Point[]): boolean {
        if (APoints.length < 3) return false

        let result = 0
        const ALat = point.x
        const ALon = point.y

        for (let i = 0; i < APoints.length; i++) {
            let dLon1, dLon2, dLat1, dLat2, dLon

            if (i === APoints.length - 1) {
                dLon1 = APoints[i].y
                dLat1 = APoints[i].x
                dLon2 = APoints[0].y
                dLat2 = APoints[0].x
            } else {
                dLon1 = APoints[i].y
                dLat1 = APoints[i].x
                dLon2 = APoints[i + 1].y
                dLat2 = APoints[i + 1].x
            }
            // 判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
            if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {
                if (Math.abs(dLat1 - dLat2) > 0) {
                    // 得到 A点向左射线与边的交点的x坐标：
                    dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2)
                    if (dLon < ALon)
                        result++
                }
            }
        }
        return result % 2 !== 0
    }

    /**
     * 线段转盒子坐标
     * @param start
     * @param end
     */
    LienToVert(start: Point, end: Point, radius: number): Point[] {
        const angle = Math.abs(this.getAngle(start, end))
        let xWidth = 0, yWidth = 0

        if (angle < 45)
            yWidth = radius / 2
        else
            xWidth = radius / 2

        return [
            {
                x: start.x - xWidth,
                y: start.y - yWidth
            },
            {
                x: end.x - xWidth,
                y: end.y - yWidth
            },
            {
                x: end.x + xWidth,
                y: end.y + yWidth
            },
            {
                x: start.x + xWidth,
                y: start.y + yWidth
            }
        ]
    }

    /**
     * 获取线段角度
     * @param start
     * @param end
     */
    getAngle(start: Point, end: Point): number {
        if (start.y === end.y && end.x < start.x) return 180
        const x = end.x - start.x
        const y = end.y - start.y
        const k = y / x
        return Math.atan(k) / Math.PI * 180
    }

    /**
     * 获取材质并缓存
     * @param id
     * @param url
     */
    getMaterial(id: number, url: string): Promise<ImageBitmap> {
        return new Promise((res) => {

            const cache = this.materialCache[String(id)]
            if (cache) {
                res(cache)
                return
            }

            const img = new Image()

            async function onError() {
                const data = new ImageData(0, 0)
                const imgBitMap = await createImageBitmap(data)
                res(imgBitMap)
            }

            img.onload = async () => {
                try {
                    const imgBitMap = await createImageBitmap(img)
                    this.materialCache[String(id)] = imgBitMap
                    res(imgBitMap)
                } catch (error) {
                    onError()
                }
            }

            img.onerror = onError

            img.src = url
        })
    }

    /**
     * 返回正确的坐标值与宽高
     * @param x
     * @param y
     * @param width
     * @param height
     */
    getPoint(x: number, y: number, width?: number, height?: number): Rect {
        const result = { x, y, width, height }
        result.y = y > 60 ? y - 60 : 0
        result.y *= this.scale
        result.x *= this.scale
        if (result.width) result.width *= this.scale
        if (result.height) result.height *= this.scale
        return result
    }

    /** 清除画布内容 */
    clear(): void {
        this.Content?.clearRect(0, 0, this.Canvas?.width || 0, this.Canvas?.height || 0)
    }

    /** 是否选中对象 */
    select(event: MouseEvent): StackItem | null { // eslint-disable-line @typescript-eslint/no-unused-vars,no-unused-vars
        // coding...
        return null
    }

    render(): void {
        // window.requestAnimationFrame(() => this._render())
        SchedulerController.run(() => this._render())
    }

    _render(): void {
        this.clear()
        // coding...
    }
}

export {
    Scenes
}
