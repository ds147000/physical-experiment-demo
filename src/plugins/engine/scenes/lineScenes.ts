import { Scenes } from './scenes'
import { Point, stack, StackItem } from '../stack/stack'

const lineWidth = 6
const lineJoin = 'round'
const lineCap = 'round'
const fillStyle = '#F1EE17'
const strokeStyle = '#B93629'

export class LineScenes extends Scenes {
    constructor() {
        super()
        stack.subscription(type => type === 'line' && this.render())
    }

    _render(): void {
        super._render()
        // 遍历栈堆节点
        stack.get('line').forEach(async item => {
            if (!item || this.Content === null) return

            this.Content.beginPath()
            this.Content.shadowBlur = 0
            this.Content.shadowOffsetX = 0
            this.Content.shadowOffsetY = 0
            this.Content.fillStyle = fillStyle
            this.Content.strokeStyle = strokeStyle
            this.Content.lineWidth = lineWidth
            this.Content.lineJoin = lineJoin
            this.Content.lineCap = lineCap

            if (item.hover === true || item.select === true) {
                this.Content.shadowBlur = 20
                this.Content.shadowColor = this.Content.strokeStyle
                this.Content.shadowOffsetX = 2
                this.Content.shadowOffsetY = 2
            }

            // 绘制线条
            const { path } = item
            const start = this.getPoint(path[0].x, path[0].y)
            const end = this.getPoint(path[path.length - 1].x, path[path.length - 1].y)
            this.Content.moveTo(start.x, start.y)

            for(let i = 1; i < path.length; i ++) {
                const point = this.getPoint(path[i].x, path[i].y)
                this.Content.lineTo(point.x, point.y)
            }

            this.Content.stroke()

            // 绘制端点
            const angle = 360 * Math.PI / 180
            this.Content.beginPath()
            this.Content.arc(start.x, start.y, lineWidth, 0, angle)
            this.Content.arc(end.x, end.y, lineWidth, 0, angle)
            this.Content.fill()
        })

    }

    /**
     * 是否选择线段
     * @param event
     * @param seletcPath 是否记录选择的路径
     */
    select(event: MouseEvent, seletcPath = true): StackItem | null {
        const point = this.getPoint(event.pageX, event.pageY)

        const selectItem = stack.get('line').find(item => {
            if (!item) return false // 为null，阻止计算
            const { path } = item

            // 判断是否选择点是端点
            const pointIndex = this.isPontInPoints(point, path)
            if (pointIndex !== -1) {
                item.selectPathIndex = pointIndex
                return true
            }

            // 判断是否为点与点的之间
            for(let i = 1; i < path.length; i ++) {
                const start = this.getPoint(path[i - 1].x, path[i - 1].y)
                const end = this.getPoint(path[i].x, path[i].y)

                const vert = this.LienToVert(start, end, lineWidth * 1.5)
                const isVert = this.inVertBox(point, vert)

                if (isVert && seletcPath) {
                    item.path.splice(i, 0, { x: event.pageX, y: event.pageY })
                    item.selectPathIndex = i
                    return true
                } else if (isVert)
                    return true
            }

            return false
        })

        return selectItem || null
    }

    /**
     * 测量当前坐标点是否存在坐标点数组
     * @param point
     * @param path
     */
    isPontInPoints(point: Point, path: Point[]): number {
        const radius = Math.round(lineWidth * 1.5)

        return path.findIndex(item => {
            const realItem = this.getPoint(item.x, item.y)
            return Math.abs(point.x - realItem.x) < radius && Math.abs(point.y - realItem.y) < radius
        })
    }
}

const LineVC = new LineScenes

export { LineVC }
