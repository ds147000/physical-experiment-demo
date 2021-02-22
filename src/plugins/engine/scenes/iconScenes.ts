import { Scenes } from './scenes'
import { stack, StackItem } from '../stack/stack'

export class IconScenes extends Scenes {
    constructor() {
        super()
        stack.subscription(type => type === 'icon' && this.render())
    }

    _render(): void {
        super._render()

        // 遍历栈堆节点
        stack.get('icon').forEach(async item => {
            if (!item || this.Content === null) return

            const { path } = item
            if(item.select === true || item.hover === true) { // 激活状态
                const rectSize = this.getPoint(
                    path[0].x - 7,
                    path[0].y - 7,
                    item.width + 14,
                    item.height + 14
                )
                this.Content.fillStyle = 'rgba(255, 255, 255, 0.4)'
                this.Content.fillRect(rectSize.x, rectSize.y, rectSize.width as number, rectSize.height as number)
            }

            const img = await this.getMaterial(item.id, item.url as string)
            const { x, y } = this.getPoint(path[0].x, path[0].y)
            this.Content.drawImage(img, x, y, item.width, item.height)
        })

    }

    /** 是否选中节点 */
    select(event: MouseEvent): null | StackItem {
        const point = this.getPoint(event.pageX, event.pageY)

        const selectedItem = stack.get('icon').find(item => {
            if (!item) return false
            const { path } = item
            const rect = this.getPoint(path[0].x, path[0].y, item.width, item.height)
            return this.inBox(point, rect)
        })

        return selectedItem || null
    }
}

const IconVC = new IconScenes

export { IconVC }
