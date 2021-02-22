import { Scenes } from './scenes'
import { waitFor } from '@testing-library/react'
import 'jest-canvas-mock'

describe('test class the Scenes', () => {
    const scenes = new Scenes()

    test('init', () => {
        const div: any = document.createElement('div')
        scenes.init(div)
        expect(scenes.Canvas).toBe(null)
        expect(scenes.Content).toBe(null)

        const canvas = document.createElement('canvas')
        canvas.width = 700
        canvas.height = 450

        scenes.init(canvas)
        expect(scenes.Canvas).toBe(canvas)
        expect(scenes.Content).not.toBe(null)
    })

    describe.each([
        [0, 0, true],
        [-1, -1, false],
        [700, 450, true],
        [Math.random() * 700, Math.random() * 450, true],
        [800, 800, false],

    ])('test inViewBox 测试坐标是否在画布', (a, b, expected) => {
        test(`${a},${b} return ${expected}`, () => {
            expect(scenes.inViewBox(a, b)).toBe(expected)
        })
    })

    describe.each([
        [{ x: 0, y: 0}, { x: 0, y: 0, width: 100, height: 100 }, true],
        [{ x: 0, y: 0}, { x: 0, y: 0, width: 10, height: 10 }, true],
        [{ x: 0, y: 0}, { x: 0, y: 0, radius: 10 }, true],
        [{ x: 10, y: 20}, { x: 0, y: 0, width: 50, height: 100 }, true],
        [{ x: 100, y: 200}, { x: 80, y: 190, width: 50, height: 50 }, true],
        [{ x: 33.333, y: 33.33}, { x: 30, y: 30, width: 10, height: 10 }, true],
        [{ x: 5, y: 5}, { x: 0, y: 0, radius: 6 }, true],
        [{ x: 5, y: 5}, { x: 10, y: 10, width: 1000, height: 500 }, false],
        [{ x: 0, y: 0}, { x: 1, y: 1, width: 200, height: 200 }, false],
        [{ x: 50, y: 50}, { x: 0, y: 0, radius: 49 }, false],
        [{ x: 50, y: 50}, { x: 0, y: 0 }, false]
    ])('test inBox 测试坐标位于盒子', (a, b, expected) => {
        test(`point={x:${a.x}, y:${a.y}} rect=${JSON.stringify(b)} return ${expected}`, () => {
            expect(scenes.inBox(a, b)).toBe(expected)
        })
    })

    describe.each([
        [{ x: 0, y: 0 }, { x: 1, y: 1 }, 45],
        [{ x: 0, y: 0 }, { x: 0, y: 1 }, 90],
        [{ x: 0, y: 0 }, { x: 10, y: 0 }, 0],
        [{ x: 0, y: 0 }, { x: -10, y: 0 }, 180],
        [{ x: 0, y: 0 }, { x: 0, y: -10 }, -90],
        [{ x: 0, y: 0 }, { x: -2, y: -2 }, 45],
    ])('test getAngle 获取角度', (a, b, expected) => {
        test(`start=${JSON.stringify(a)} end=${JSON.stringify(b)} return=${expected}`, () => {
            expect(scenes.getAngle(a, b)).toBe(expected)
        })
    })

    describe.each([
        [
            { x: 4, y: 4 }, { x: 40, y: 4 }, 4,
            [{ x: 4, y: 2 }, { x: 40, y: 2 }, { x: 40, y: 6 }, { x: 4, y: 6 }]
        ],
        [
            { x: 50, y: 50 }, { x: 50, y: 100 }, 10,
            [{ x: 45, y: 50 }, { x: 45, y: 100 }, { x: 55, y: 100 }, { x: 55, y: 50 }]
        ],
        [
            { x: 50, y: 50 }, { x: 75, y: 70 }, 10,
            [{ x: 50, y: 45 }, { x: 75, y: 65 }, { x: 75, y: 75 }, { x: 50, y: 55 }]
        ],
        [
            { x: 50, y: 50 }, { x: 75, y: 80 }, 10,
            [{ x: 45, y: 50 }, { x: 70, y: 80 }, { x: 80, y: 80 }, { x: 55, y: 50 }]
        ]
    ])('test LienToVert 线段转盒子', (a, b, c, expected) => {
        test(`lienStart=${JSON.stringify(a)} lineEnd=${JSON.stringify(b)} return ${expected}`, () => {
            expect(scenes.LienToVert(a, b, c)).toStrictEqual(expected)
        })
    })

    describe.each([
        [{ x: 10, y: 10 }, [{ x: 4, y: 2 }, { x: 40, y: 2 }, { x: 40, y: 6 }, { x: 4, y: 6 }], false],
        [{ x: 10, y: 10 }, [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 0, y: 40 }], true],
        [{ x: 15, y: 12 }, [{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 25, y: 30 }, { x: 16, y: 15 }], true]
    ])('test inVertBox 测量坐标是否在多边形区域内', (a, b, expected) => {
        test(`point=${JSON.stringify(a)} rect=${JSON.stringify(b)} return=${expected}`, () => {
            expect(scenes.inVertBox(a, b)).toBe(expected)
            expect(scenes.inPtInPoly(a, b)).toBe(expected)
        })
    })

    describe.each([
        [10, 100, 0, 0, 1, { x: 10, y: 40, width: 0, height: 0 }],
        [80, 50, 0, 0, 1, { x: 80, y: 0, width: 0, height: 0 }],
        [0, 150, 60, 20, 1, { x: 0, y: 90, width: 60, height: 20 }],
        [30, 200, 60, 20, 1, { x: 30, y: 140, width: 60, height: 20 }],
    ])('test getPoint 获取正确的坐标与宽高', (x, y, w, h, scale, expected) => {
        scenes.scale = scale
        expect(scenes.getPoint(x, y, w, h)).toStrictEqual(expected)
    })

    test('test render', async () => {
        scenes.clear = jest.fn()
        scenes.render()
        await waitFor(() => expect(scenes.clear).toHaveReturnedTimes(1), { interval: 100 })
    })
})
