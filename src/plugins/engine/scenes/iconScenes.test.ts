import { stack } from '../stack/stack'
import { IconScenes } from './iconScenes'
import 'jest-canvas-mock'

describe('test the IconScenes', () => {
    const IconVC = new IconScenes
    const canvas = document.createElement('canvas')
    IconVC.init(canvas)

    test('test the seleted', () => {
        stack.push({
            type: 'line',
            url: '',
            id: 0,
            title: '线段',
            config: { width: 80, height: 4 }
        }, 100, 100)

        stack.push({
            type: 'line',
            url: '',
            id: 0,
            title: '线段',
            config: { width: 80, height: 4 }
        }, 180, 180)

        stack.push({
            type: 'icon',
            url: '',
            id: 1,
            title: '图标',
            config: { width: 40, height: 40 }
        }, 300, 250)

        stack.push({
            type: 'icon',
            url: '',
            id: 1,
            title: '图标',
            config: { width: 40, height: 40 }
        }, 400, 120)

        const event: any = { pageX: 320, pageY: 260 }
        const selectItem = IconVC.select(event)
        expect(selectItem?.index).toBe(2)
        expect(IconVC.select({ pageX: 301, pageY: 251 } as any)?.index).toBe(2)
        expect(IconVC.select({ pageX: 410, pageY: 121 } as any)?.index).toBe(3)
        expect(IconVC.select({ pagex: 50, pageY: 100 } as any)).toBe(null)
    })

    test('test the _render', () => {
        const item = IconVC.select({ pageX: 320, pageY: 260 } as any)
        if (item) {
            item.select = true
            stack.setItem('icon', item.index, item)
        }
        expect(IconVC._render()).toBeUndefined()
    })
})
