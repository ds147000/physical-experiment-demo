import { ITEM_TYPES, MenuListItem } from '../../../config/menu'

export interface Point {
    x: number
    y: number
}

export interface StackItem {
    /** @public 选择状态 */
    select: boolean
    /** @public 路径点 */
    path: Point[]
    /** @public 当前激活修改路径位置索引 */
    selectPathIndex?: number
    /** @public 与当前对象发生链接 */
    connect: Connect[]
    /** @public 当前节点id */
    readonly index: number
    /** @public 当前节点类型 */
    readonly type: ITEM_TYPES
    /** @public 节点图片资源索引记录 */
    readonly id: number
    /** @public 当前图标url */
    readonly url?: string
    /** @public 当前节点的链接处 */
    readonly points?: Point[]
    /** @public 当前节点实际宽度 */
    readonly width: number
    /** @public 当前节点实际高度 */
    readonly height: number
}

type TYPE = 'icon' | 'line'
type ConnectType = 'start' | 'end'

interface emitCallback {
    (type: ITEM_TYPES): void // eslint-disable-line no-unused-vars
}

interface Connect {
    index: number
    type: ConnectType
}

export const outputStack = (
    index: number,
    id: number,
    type: TYPE,
    x: number,
    y: number,
    width: number,
    height: number,
    points?: Point[]
): StackItem => {
    const path: Point[] = type === 'icon' ?
        [{ x, y }] :
        [{ x: x, y }, { x: x + width, y }]

    return {
        index, id,
        type,
        select: false,
        width,
        height,
        points,
        path,
        connect: []
    }
}

class Stack {
    private lineStack: Array<StackItem | undefined> = new Array(1000)
    private iconStack: Array<StackItem | undefined> = new Array(1000)
    private len = -1
    private subscriptionList: emitCallback[] = []

    push(data: MenuListItem, x: number, y: number): number {
        this.len++
        if (this.len >= this.lineStack.length) this.double()

        const { type, config, url, id } = data


        const item: StackItem = outputStack(
            this.len,
            id,
            type,
            x,
            y,
            config.width,
            config.height,
            config.points
        )

        if (type === 'icon')
            this.iconStack[this.len] = { ...item, url }
        else if (type === 'line')
            this.lineStack[this.len] = item

        this.emit(type)
        return this.len
    }

    /**
     * 设置栈
     * @param type
     * @param data
     */
    set(type: ITEM_TYPES, data: Array<StackItem | undefined>) {
        if (type === 'icon')
            this.iconStack = data
        else if (type === 'line')
            this.lineStack = data
        this.emit(type)
    }

    /**
     * 获取栈
     * @param type
     */
    get(type: ITEM_TYPES): Array<StackItem | undefined> {
        return type === 'icon' ? this.iconStack : this.lineStack
    }

    /**
     * 获取栈某项
     * @param type
     * @param index
     */
    getItem(type: ITEM_TYPES, index: number): StackItem | undefined {
        return type === 'icon' ? this.iconStack[index] : this.lineStack[index]
    }

    /**
     * 设置栈某项
     * @param type
     * @param index
     */
    setItem(type: ITEM_TYPES, index: number, item: StackItem | undefined): void {
        if (index >= this.iconStack.length) this.double()
        if (type === 'icon')
            this.iconStack[index] = item


        else if (type === 'line')
            this.lineStack[index] = item
        this.emit(type)
    }

    /**
     * 线段链接元素
     * @param start
     * @param end
     */
    lienConncetIcon(index: number): void {
        let startStatus = false, endStatus = false

        const newIconSatck = this.get('icon').map(item => {
            if (!item) return item
            if (!item.points) return item
            item.connect = item.connect.filter(item => item.index !== index)

            if (startStatus && endStatus) return item

            for (let i = 0; i < item.points.length; i++) {
                let { x, y } = item.points[i]
                x += item.path[0].x
                y += item.path[0].y

                if (this.lineConnectIconCall(index, 'start', x, y)) {
                    item.connect.push({ index, type: 'start' })
                    startStatus = true
                    return item
                }
                else if (this.lineConnectIconCall(index, 'end', x, y)) {
                    item.connect.push({ index, type: 'end' })
                    endStatus = true
                    return item
                }
            }
            return item
        })

        this.set('icon', newIconSatck)
    }

    lineConnectIconCall(index: number, type: ConnectType, x: number, y: number): boolean {
        const radius = 10
        const item = this.getItem('line', index) as StackItem
        const cPath = type === 'start' ? item.path[0] : item.path[item.path.length - 1]

        if (Math.abs(cPath.x - x) < radius && Math.abs(cPath.y - y) < radius) {
            if (type === 'start') item.path[0] = { x, y }
            else item.path[item.path.length - 1] = { x, y }

            this.setItem('line', index, item)
            return true
        }
        return false
    }

    /** 订阅栈变化回调 */
    subscription(callback: emitCallback) {
        this.subscriptionList.push(callback)
    }

    /** 发布事件 */
    private emit(type: ITEM_TYPES) {
        this.subscriptionList.forEach(item => item(type))
    }

    /** 长度翻倍 */
    private double() {
        this.lineStack = this.lineStack.concat(new Array(1000))
        this.iconStack = this.iconStack.concat(new Array(1000))
    }
}

const stack = new Stack

export { stack }
