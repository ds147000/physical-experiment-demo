import { ITEM_TYPES, MeunList } from "../../../config/menu"
import { LienVC, IconVC } from '../scenes'
import { stack, StackItem } from '../stack/stack'
import { store } from '../../../store'


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
                MeunList.find(item => {
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

class HandleEvent {
    private state: HandleEventState = { activeId: null, icon: null }
    private dragItem: StackItem | null = null

    constructor() {
        this.state = new Proxy(this.state, handleProxy)
        this.init()
    }

    /** 初始化 */
    init(): void {
        window.addEventListener('mouseup', this.up.bind(this))
        window.addEventListener('mousemove', this.move.bind(this))
        window.addEventListener('contextmenu', this.menu.bind(this))
        window.addEventListener('mousedown', this.down.bind(this))
    }

    /** 激活 */
    setActive(type: number): void {
        this.state.activeId = type
    }

    /** 鼠标移动 */
    move(event: MouseEvent): void {
        if (this.state.icon) // 放置元素
            this.moveState(event.pageX, event.pageY)

        else if (this.dragItem?.type === 'icon') // 拖动物件
            this.drag(event.movementX, event.movementY, 'icon')

        else if (this.dragItem?.type === 'line') // 拖动跳线
            this.drag(event.movementX, event.movementY, 'line')
    }

    /** 鼠标抬起 */
    up(event: MouseEvent): void {
        // 元素放入画布操作
        if (this.state.activeId !== null) {

            const { pageX, pageY } = event
            const inView = LienVC.inViewBox(pageX, pageY) // 判断失去焦点前是否在画布区域内

            if (inView === false) return

            const stackItem = MeunList.find(item => item.id === this.state.activeId)
            if (stackItem)
                stack.push(stackItem, pageX - stackItem.config.width / 2, pageY - stackItem.config.height / 2)

        }

        // 操作画布内元素操作
        else if (this.dragItem !== null)
            stack.connceting(this.dragItem.type, this.dragItem.index)

        this.state.activeId = null
        this.dragItem = null
    }

    down(event: MouseEvent): void {
        this.resetEvent()
        if (event.button !== 0) return
        const selectItem = LienVC.select(event) || IconVC.select(event)

        this.dragItem = selectItem
    }

    /** 鼠标右键 */
    menu(event: MouseEvent): void {
        const selectItem = LienVC.select(event) || IconVC.select(event)

        if (selectItem === null) return

        function setSelect(item: StackItem | null): StackItem | null {
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
    }

    /** 拖拽元素或者线条 */
    drag(x: number, y: number, type: ITEM_TYPES) {
        if (this.dragItem === null || this.dragItem.type !== type) return

        const item = stack.getItem(type, this.dragItem.index)
        if (item === null) {
            this.dragItem = null
            return
        }
        const pathIndex = this.dragItem.selectPathIndex || 0 // 如果不存在selectPathIndex即拖拽0坐标

        item.path[pathIndex].x += x
        item.path[pathIndex].y += y
        if (item.connect.length > 0) {
            item.connect.forEach(connecting => {
                const lineItem = stack.getItem('line', connecting.index)
                if (lineItem === null) return

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
     * 移动控件
     * @param x
     * @param y
     */
    moveState(x: number, y: number) {
        if (this.state.icon === null) return
        this.state.icon.style.top = y - this.state.icon.offsetHeight / 2 + 'px'
        this.state.icon.style.left = x - this.state.icon.offsetWidth / 2 + 'px'
    }

    /** 重置所以事件状态 */
    resetEvent() {
        if (store.getState().contextmenu.show) store.dispatch.contextmenu.hide()

        function reset(item: StackItem | null): StackItem | null {
            if (item)
                item.select = false
            return item
        }
        const iconStack = stack.get('icon').map(reset)
        const lineStack = stack.get('line').map(reset)
        stack.set('icon', iconStack)
        stack.set('line', lineStack)
    }

    /** 删除某个节点 */
    delete(index: number) {
        stack.setItem('icon', index, null)
        stack.setItem('line', index, null)
    }
}

const handleEvent = new HandleEvent()

export { handleEvent }