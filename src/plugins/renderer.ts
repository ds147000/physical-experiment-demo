import RendererBasis from './basis'
import { LineVC, IconVC } from './engine/scenes'
import { SchedulerController } from './engine/scheduler'


class Renderer extends RendererBasis {
    private CanvasLine: HTMLCanvasElement | null = null
    private CanvasIcon: HTMLCanvasElement | null = null

    init(canvasLine: HTMLCanvasElement, canvasIcon: HTMLCanvasElement): void {
        this.CanvasLine = canvasLine
        this.CanvasIcon = canvasIcon
        window.addEventListener('resize', () => this.resetSize())
        this.resetSize()
        this.render()
    }

    /** 重设画布实际大小 */
    resetSize(): void {
        SchedulerController.runIdle(() => {
            if (this.CanvasIcon === null || this.CanvasLine === null) return

            const offsetHeight = window.innerHeight - 60
            const offsetWidth = this.CanvasLine.clientWidth
            this.setSize([this.CanvasLine, this.CanvasIcon], offsetWidth, offsetHeight)
            this.render()
        })
    }

    /**
     * 设置画布实际大小
     * @param canvas 画布数组
     * @param width
     * @param height
     */
    setSize(canvas: HTMLCanvasElement[], width: number, height: number) {
        canvas.map(item => {
            item.width = width
            item.height = height
        })
    }

    /**
     * 缩放
     * @param val
     */
    sacle(val: number): void {
        SchedulerController.runIdle(() => {
            let scaleValue = val / 100
            scaleValue = scaleValue < 0.2 ? 0.2 : scaleValue

            LineVC.scale = scaleValue
            IconVC.scale = scaleValue
            this.render()
        })
    }

    /**
     * 导出图片
     */
    async export() {
        if (this.CanvasIcon === null || this.CanvasLine === null)
            return Promise.resolve('base64')

        const canvas = document.createElement('canvas')
        canvas.width = this.CanvasIcon.width
        canvas.height = this.CanvasIcon.height
        const context = canvas.getContext('2d')
        if (!context) return Promise.resolve('base64')

        context.drawImage(this.CanvasIcon, 0, 0)
        context.drawImage(this.CanvasLine, 0, 0)
        const data = canvas.toDataURL()
        return Promise.resolve(data)
    }

    /** 输出 */
    render(): void {
        LineVC.render()
        IconVC.render()
    }
}

const RendererVC = new Renderer

export { RendererVC }
