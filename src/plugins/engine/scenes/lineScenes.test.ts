import { LineScenes } from './lineScenes'
import { stack } from '../stack/stack'
import 'jest-canvas-mock'

describe('test class lineScene', () => {
    const LineVC = new LineScenes
    const canvas = document.createElement('canvas')
    LineVC.init(canvas)

    describe.each([
        [{ x: 10, y: 70 }, [{ x: 4, y: 4}, { x: 10, y: 70}, { x: 40, y: 100 }], 1],
        [{ x: 10, y: 100 }, [{ x: 4, y: 4}, { x: 10, y: 70}, { x: 40, y: 100 }], -1],
        [{ x: 100, y: 100 }, [{ x: 40, y: 40}, { x: 65, y: 83}, { x: 95, y: 95 }], 2],
        [{ x: 300, y: 220 }, [{ x: 298, y: 220}, { x: 0, y: 83}], 0],
        [{ x: 100, y: 100 }, [{ x: 90, y: 90}, { x: 65, y: 83}, { x: 120, y: 120 }], -1]
    ])('isPontInPoints 测试坐标是否在坐标数组范围', (point, path, expected) => {
        test(`point: ${JSON.stringify(point)} points: ${JSON.stringify(path)} return ${expected}`, () => {
            const _point = LineVC.getPoint(point.x, point.y)
            expect(LineVC.isPontInPoints(_point, path)).toBe(expected)
        })
    })

    test('test the selected', () => {
        stack.push({
            type: 'icon',
            title: 'dc',
            id: 1,
            url: '',
            config: { width: 40, height: 40 }
        }, 80, 80)

        stack.push({
            type: 'line',
            title: '线段',
            id: 0,
            url: '',
            config: {
                width: 80,
                height: 4,
                points: [{ x: 0, y: 2 }, { x: 80, y: 2 }]
            }
        }, 240, 80)

        const index = stack.push({
            type: 'line',
            title: '线段',
            id: 0,
            url: '',
            config: {
                width: 80,
                height: 4,
                points: [{ x: 0, y: 2 }, { x: 80, y: 2 }]
            }
        }, 200, 200)

        const item = stack.getItem('line', index)
        if (item) {
            item.path[0] = { x: 80, y: 80 }
            item.path[1] = { x: 140, y: 80 }
            item.path.push({ x: 300, y: 150 })
            stack.setItem('line', index, item)
        }

        const event: any = { pageX: 142, pageY: 82, altKey: true }
        const selectItem = LineVC.select(event)
        expect(selectItem?.index).toBe(index)

        const event2: any = { pageX: 100, pageY: 81 }
        const selectedItem2 = LineVC.select(event2)
        expect(selectedItem2?.index).toBe(index)

        if (selectedItem2) {
            selectedItem2.select = true
            stack.setItem('line', selectedItem2?.index, selectedItem2)
        }
    })

    test('test the seleted', () => {
        const event: any = { pageX: 500, pageY: 0 }
        const select = LineVC.select(event)
        expect(select).toBe(null)
    })

    test('test the render', () => {
        expect(LineVC._render()).toBeUndefined()
    })
})
