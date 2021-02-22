import { ITEM_TYPES, MenuList } from "../../../config/menu"
import { LineVC, IconVC } from '../scenes'
import { stack, StackItem } from '../stack/stack'
import { store } from '../../../store'
import { SchedulerController } from '../scheduler'

interface EventHandleFun {
    (event: MouseEvent): void // eslint-disable-line no-unused-vars
}

interface HandleEventState {
    activeId: number | null
    icon: HTMLImageElement | null
}

const handleProxy: ProxyHandler<HandleEventState> = {
    set(target, key, val: number | null) {
        if (key === 'activeId') {
            if (target.icon) {
                document.body.removeChild(target.icon)
                Reflect.set(target, 'icon', null)
            }

            if (val !== null) {
                MenuList.find(item => {
                    if (item.id !== val) return false

                    const icon = document.createElement('img')
                    icon.src = item.url
                    icon.setAttribute('class', 'handle-icon')
                    icon.setAttribute('draggable', 'false')
                    document.body.append(icon)
                    Reflect.set(target, 'icon', icon)
                    return true
                })
            }
        }

        Reflect.set(target, key, val)
        return true
    }
}

export class HandleEvent {
    private state: HandleEventState = { activeId: null, icon: null }
    private dragItem: StackItem | null = null
    private _down: EventHandleFun | undefined = undefined
    private _move: EventHandleFun | undefined = undefined
    private _up: EventHandleFun | undefined = undefined
    private _menu: EventHandleFun | undefined = undefined

    constructor() {
        this.state = new Proxy(this.state, handleProxy)
        this.init()
    }

    /** 初始化 */
    init(): void {
        this._down = this.down.bind(this)
        this._move = this.move.bind(this)
        this._up = this.up.bind(this)
        this._menu = this.menu.bind(this)

        window.addEventListener('mousedown', this._down)
        window.addEventListener('mousemove', this._move)
        window.addEventListener('mouseup', this._up)
        window.addEventListener('contextmenu', this._menu)
    }

    /** 激活 */
    setActive(activeId: number): void {
        this.state.activeId = activeId
    }

    getActive(): number | null {
        return this.state.activeId
    }

    /** 鼠标按下 */
    down(event: MouseEvent): void {
        this.resetEvent()
        if (event.button !== 0) return
        const selectItem = LineVC.select(event) || IconVC.select(event)
        this.dragItem = selectItem
    }

    /** 鼠标移动 */
    move(event: MouseEvent): void {
        if (this.state.icon) // 放置元素
            SchedulerController.run(() => this.moveState(event.pageX, event.pageY))

        else if (this.dragItem?.type === 'icon') // 拖动物件
            SchedulerController.run(() => this.drag(event.movementX, event.movementY, 'icon'))


        else if (this.dragItem?.type === 'line') // 拖动跳线
            SchedulerController.run(() => this.drag(event.movementX, event.movementY, 'line'))

        else {

            SchedulerController.runSingleIdle(() => {
                function reset(item: StackItem | undefined): StackItem | undefined {
                    if (item) item.hover = false
                    return item
                }
                const lineList = stack.get('line').map(reset)
                const iconList = stack.get('icon').map(reset)

                const selectItem = LineVC.select(event, false) || IconVC.select(event)
                if (selectItem) {
                    selectItem.hover = true
                    if (selectItem.type === 'icon')
                        iconList[selectItem.index] = selectItem
                    else if (selectItem.type === 'line')
                        lineList[selectItem.index] = selectItem
                }
                stack.set('icon', iconList)
                stack.set('line', lineList)
            }, 'hover')
        }
    }

    /** 鼠标抬起 */
    up(event: MouseEvent): void {
        // 元素放入画布操作
        if (this.state.activeId !== null) {
            const activeId = this.state.activeId
            const { pageX, pageY } = event

            SchedulerController.run(() => {
                const inView = LineVC.inViewBox(pageX, pageY) // 判断失去焦点前是否在画布区域内

                if (inView === false) return

                const stackItem = MenuList.find(item => item.id === activeId)
                if (stackItem)
                    stack.push(stackItem, pageX - stackItem.config.width / 2, pageY - stackItem.config.height / 2)
            })
        }
        // 操作画布内元素操作
        else if (this.dragItem !== null && this.dragItem.type === 'line') {
            const index = this.dragItem.index
            SchedulerController.runIdle(() => stack.lienConncetIcon(index))
        }

        this.state.activeId = null
        this.dragItem = null
    }

    /** 鼠标右键 */
    menu(event: MouseEvent): void {
        if (event.button !== 2) return

        SchedulerController.run(() => {
            const selectItem = LineVC.select(event) || IconVC.select(event)

            if (selectItem === null) return

            function setSelect(item: StackItem | undefined): StackItem | undefined {
                if (!item) return item
                item.select = item.index === selectItem?.index && item.id === selectItem.id
                return item
            }

            const iconStack = stack.get('icon').map(setSelect)
            const lineStack = stack.get('line').map(setSelect)
            stack.set('icon', iconStack)
            stack.set('line', lineStack)

            store.dispatch.contextmenu.show({
                show: true,
                x: selectItem.path[0].x + selectItem.width,
                y: selectItem.path[0].y + selectItem.height,
                selectIndex: selectItem.index
            })
        })
    }

    /** 拖拽元素或者线条 */
    private drag(x: number, y: number, type: ITEM_TYPES) {
        if (this.dragItem === null || this.dragItem.type !== type) return

        const item = stack.getItem(type, this.dragItem.index) as StackItem
        const pathIndex = this.dragItem.selectPathIndex || 0 // 如果不存在selectPathIndex即拖拽0坐标

        item.path[pathIndex].x += x
        item.path[pathIndex].y += y
        if (item.connect.length > 0) {
            item.connect.forEach(connecting => {
                const lineItem = stack.getItem('line', connecting.index)
                if (lineItem === undefined) return

                if (connecting.type === 'start') {
                    lineItem.path[0].x += x
                    lineItem.path[0].y += y
                } else {
                    lineItem.path[lineItem.path.length - 1].x += x
                    lineItem.path[lineItem.path.length - 1].y += y
                }

                stack.setItem('line', connecting.index, lineItem)
            })
        }
        stack.setItem(type, this.dragItem.index, item)
    }

    /**
     * 移动元素
     * @param x
     * @param y
     */
    private moveState(x: number, y: number) {
        if (this.state.icon === null) return
        this.state.icon.style.top = y - this.state.icon.offsetHeight / 2 + 'px'
        this.state.icon.style.left = x - this.state.icon.offsetWidth / 2 + 'px'
    }

    /** 重置所以事件状态 */
    resetEvent(): void {
        if (store.getState().contextmenu.show) store.dispatch.contextmenu.hide()

        SchedulerController.run(() => {
            function reset(item: StackItem | undefined): StackItem | undefined {
                if (item)
                    item.select = false

                return item
            }
            const iconStack = stack.get('icon').map(reset)
            const lineStack = stack.get('line').map(reset)
            stack.set('icon', iconStack)
            stack.set('line', lineStack)
        })
    }

    /** 删除某个节点 */
    delete(index: number): void {
        SchedulerController.runIdle(() => {
            stack.setItem('icon', index, undefined)
            stack.setItem('line', index, undefined)
        })
    }

    /** 销毁 */
    destroy(): void {
        this.dragItem = null
        this.state.activeId = null
        if (this._down)
            window.removeEventListener('mousedown', this._down)
        if (this._move)
            window.removeEventListener('mousemove', this._move)
        if (this._up)
            window.removeEventListener('mouseup', this._up)
        if (this._menu)
            window.removeEventListener('contextmenu', this._menu)
    }
}

const handleEvent = new HandleEvent()

export { handleEvent }
