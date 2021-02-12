import { contextmenu } from './contextmenu'
import { init } from '@rematch/core'

describe('test contextmenu redux modules', () => {
    const store = init({ models: { contextmenu } })

    test('测试显示菜单', () => {
        store.dispatch.contextmenu.show({ x: 0, y: 0, selectIndex: 0, show: true })
        const data = store.getState().contextmenu

        expect(data.x).toBe(0)
        expect(data.y).toBe(0)
        expect(data.selectIndex).toBe(0)
        expect(data.show).toBe(true)
    })

    test('测试关闭菜单', () => {
        store.dispatch.contextmenu.hide()
        const data = store.getState().contextmenu

        expect(data.x).toBe(0)
        expect(data.y).toBe(0)
        expect(data.selectIndex).toBe(null)
        expect(data.show).toBe(false)
    })
})
