import RendererBasis from './basis'
import { LienVC, IconVC } from './engine/scenes'


class Renderer extends RendererBasis {
    private CanvasLine: HTMLCanvasElement | null = null
    private CanvasIcon: HTMLCanvasElement | null = null

    init(canvasLine: HTMLCanvasElement, canvasIcon: HTMLCanvasElement): void {
        this.CanvasLine = canvasLine
        this.CanvasIcon = canvasIcon
        window.addEventListener('resize', this.resetSize.bind(this))
        this.resetSize()
        this.render()
    }

    /** 重设画布实际大小 */
    resetSize(): void {
        if (this.CanvasIcon === null || this.CanvasLine === null) return

        const offsetHeight = window.innerHeight - 60
        const offsetWidth = this.CanvasLine.clientWidth
        this.setSize([this.CanvasLine, this.CanvasIcon], offsetWidth, offsetHeight)
        this.render()
    }

    /**
     * 设置画布实际大小
     * @param canvas 画布数组
     * @param width
     * @param height
     */
    private setSize(canvas: HTMLCanvasElement[], width: number, height: number) {
        canvas.map(item => {
            item.width = width
            item.height = height
        })
    }

    /** 输出 */
    public render(): void {
        LienVC.render()
        IconVC.render()
    }
}

const RendererVC = new Renderer

export { RendererVC }
