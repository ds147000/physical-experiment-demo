jest.mock('./engine/scheduler')
import { RendererVC } from './renderer'
import { LineVC, IconVC } from './engine/scenes'
import 'jest-canvas-mock'

describe('test RendererVC', () => {
    const canvasLine = document.createElement('canvas')
    const canvasIcon = document.createElement('canvas')
    canvasLine.width = 0
    canvasLine.height = 0
    canvasIcon.width = 0
    canvasIcon.height = 0

    test('init', () => {
        RendererVC.resetSize()
        RendererVC.init(canvasLine, canvasIcon)
        expect(canvasIcon.height).not.toBe(0)
        expect(canvasLine.height).not.toBe(0)
    })

    test('resetSize', () => {
        canvasLine.height = 0
        RendererVC.resetSize()
        expect(canvasLine.height).not.toBe(0)
    })

    test('setSize', () => {
        const width = 1000
        const height = 800

        RendererVC.setSize([canvasLine, canvasIcon], width, height)
        expect(canvasIcon.width).toBe(width)
        expect(canvasIcon.height).toBe(height)
        expect(canvasLine.width).toBe(width)
        expect(canvasLine.height).toBe(height)
    })

    test('setSize of limit', () => {
        const width = 100
        const height = 100

        RendererVC.setSize([], width, height)
        RendererVC.setSize([canvasLine, canvasIcon], width, height)
        expect(canvasIcon.width).toBe(width)
        expect(canvasIcon.height).toBe(height)
        expect(canvasLine.width).toBe(width)
        expect(canvasLine.height).toBe(height)

        RendererVC.setSize([canvasLine, canvasIcon], -10, -20)
        expect(canvasIcon.width).toBe(300)
        expect(canvasIcon.height).toBe(150)
        expect(canvasLine.width).toBe(300)
        expect(canvasLine.height).toBe(150)
    })

    test('render', () => {
        IconVC.render = jest.fn()
        LineVC.render = jest.fn()
        RendererVC.render()

        expect(IconVC.render).toHaveBeenCalledTimes(1)
        expect(LineVC.render).toHaveBeenCalledTimes(1)
    })

    test('export', async () => {
        const url = await RendererVC.export()
        expect(/base64/.test(url)).toBe(true)
    })

    test('change Scale to 100%', () => {
        RendererVC.sacle(100)
        expect(LineVC.scale).toBe(1)
        expect(IconVC.scale).toBe(1)
    })

    test('change Scale to 0%', () => {
        RendererVC.sacle(0)
        expect(LineVC.scale).toBe(0.2)
        expect(IconVC.scale).toBe(0.2)
    })

    test('change Scale to 0%', () => {
        RendererVC.sacle(200)
        expect(LineVC.scale).toBe(2)
        expect(IconVC.scale).toBe(2)
    })
})
