
jest.mock('../scheduler')

import { HandleEvent } from './handleEvent'
import { LineVC, IconVC } from '../scenes'
import { stack } from '../stack/stack'
import { store } from '../../../store/index'
import { fireEvent } from '@testing-library/react'
import 'jest-canvas-mock'

beforeEach(() => {
    store.dispatch.contextmenu.hide()
})

describe('test the handle behavior', () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 700
    LineVC.init(canvas)
    IconVC.init(canvas)
    const upEvent: any = { pageX: 50, pageY: 100 }
    const sub = jest.fn()
    stack.subscription(sub)
    const handle = new HandleEvent

    test('active', () => {
        handle.setActive(1)
        expect(handle.getActive()).toBe(1)
    })

    test('active to up icon 激活并拖入元素', () => {
        handle.move({ pageX: 200, pageY: 300 } as any)
        handle.up(upEvent)
        expect(handle.getActive()).toBe(null)
        expect(sub.mock.calls[0][0]).toBe('icon')

        const item = stack.getItem('icon', 0)
        expect(item?.id).toBe(1)
        if (item) {
            expect(item?.path).toStrictEqual([{
                x: upEvent.pageX - item?.width / 2,
                y: upEvent.pageY - item?.height / 2
            }])
        }
        expect(handle.getActive()).toBe(null)
    })

    test('hover icon 测试鼠标移入效果', () => {
        handle.move(upEvent)
        let item = stack.getItem('icon', 0)
        expect(item?.id).toBe(1)
        expect(item?.hover).toBe(true)

        handle.move({ pageX: 10, pageY: 20 } as any)
        item = stack.getItem('icon', 0)
        expect(item?.hover).toBe(false)
    })

    test('not active to move and up 没有激活元素移动和抬起', () => {
        handle.move({ pageY: 100, pageX: 10 } as any)
        handle.up({ pageX: 500, pageY: 350 } as any)

        const item = stack.getItem('icon', 0)
        expect(item?.id).toBe(1)
        if (item) {
            expect(item?.path).toStrictEqual([{
                x: upEvent.pageX - item?.width / 2,
                y: upEvent.pageY - item?.height / 2
            }])
        }
    })

    test('down to selected icon 选择画布元素并且移动200x,200y', () => {
        handle.down({ pageX: upEvent.pageX, pageY: upEvent.pageY, button: 0 } as any)
        handle.move({ pageX: 200, pageY: 200, movementX: 200, movementY: 200 } as any)
        handle.up({ pageX: 250, pageY: 400 } as any)
        const item = stack.getItem('icon', 0)

        expect(item?.id).toBe(1)
        if (item) {
            expect(item.path).toStrictEqual([{
                x: upEvent.pageX + 200 - item.width / 2,
                y: upEvent.pageY + 200 - item.height / 2
            }])
        }
    })

    test('rightButton to down 右键选择画布元素移动应移动无效', () => {
        const item = stack.getItem('icon', 0)
        const x = item?.path[0].x
        const y = item?.path[0].y

        handle.down({ pageX: upEvent.pageX + 200, pageY: upEvent.pageY + 200, button: 2 } as any)
        handle.move({ pageX: 0, pageY: 0, movementX: - 200, movementY: - 2000 } as any)
        handle.up({ pageX: 400, pageY: 400 } as any)

        const item2 = stack.getItem('icon', 0)
        expect(item2?.id).toBe(1)
        expect(item2?.path).toStrictEqual([{ x, y }])
    })

    test('active up to line 激活线条并放入', () => {
        handle.setActive(0)
        expect(handle.getActive()).toBe(0)

        handle.up({ pageX: 400, pageY: 460 } as any)
        const item = stack.getItem('line', 1)
        expect(item?.id).toBe(0)
        if (item) {
            expect(item.path).toStrictEqual([
                {
                    x: 400 - item.width / 2,
                    y: 460 - item.height / 2
                },
                {
                    x: 400 + item.width / 2,
                    y: 460 - item.height / 2
                }
            ])
        }
        expect(handle.getActive()).toBe(null)
    })

    test('hover line 鼠标移入线段行为', () => {
        handle.move({ pageX: 400, pageY: 460 } as any)
        const item = stack.getItem('line', 1)
        expect(item?.hover).toBe(true)
    })

    test('down and move and up to select line changes path 选择线段并修改路径', () => {
        const line = stack.getItem('line', 1)
        const startX = line?.path[0].x || 0
        const startY = line?.path[0].y || 0
        const endX = line?.path[1].x || 0
        const endY = line?.path[1].y || 0

        handle.down({ pageX: startX, pageY: startY, button: 0 } as any)
        handle.move({ pageY: 0, pageX: 0, movementX: 200, movementY: 200 } as any)
        handle.up({ pageX: 0, pageY: 0 } as any)
        const newLien = stack.getItem('line', 1)
        expect(newLien?.path[0]).toStrictEqual({
            x: startX + 200,
            y: startY + 200
        })

        handle.down({ pageX: endX, pageY: endY, button: 0 } as any)
        handle.move({ pageX: 0, pageY: 0, movementX: -100, movementY: -100 } as any)
        handle.up({ pageX: 0, pageY: 0 } as any)
        const newLine2 = stack.getItem('line', 1)
        expect(newLine2?.path[1]).toStrictEqual({
            x: endX - 100,
            y: endY - 100
        })
    })

    describe('line connect icon 线段链接元素', () => {
        test('头部线段链接', () => {
            const lineItem = stack.getItem('line', 1)
            const iconItem = stack.getItem('icon', 0)

            let x = 0, y = 0
            if (iconItem?.points && lineItem) {
                x =  iconItem.path[0].x + iconItem.points[0].x - lineItem.path[0].x
                y =  iconItem.path[0].y + iconItem.points[0].y - lineItem.path[0].y
            }

            handle.down({ pageX: lineItem?.path[0].x, pageY: lineItem?.path[0].y, button: 0 } as any)
            handle.move({ movementX: x, movementY: y } as any)
            handle.up({} as any)
            expect(stack.getItem('icon', 0)?.connect.length).toBe(1)
        })

        test('尾部线段链接', () => {
            handle.setActive(0)
            handle.up({ pageX: 500, pageY: 500 } as any)

            const lineItem = stack.getItem('line', 2)
            const iconItem = stack.getItem('icon', 0)
            expect(lineItem).not.toBeUndefined()

            let x = 0, y = 0
            if (iconItem?.points && lineItem) {
                x =  iconItem.path[0].x + iconItem.points[0].x - lineItem.path[1].x
                y =  iconItem.path[0].y + iconItem.points[0].y - lineItem.path[1].y
            }

            handle.down({ pageX: lineItem?.path[1].x, pageY: lineItem?.path[1].y, button: 0 } as any)
            handle.move({ movementX: x, movementY: y } as any)
            handle.up({} as any)
            expect(stack.getItem('icon', 0)?.connect.length).toBe(2)
        })



        test('拖动链接元素', () => {
            const icon = stack.getItem('icon', 0)
            const line = stack.getItem('line', 1)

            const x = icon?.path[0].x || 0
            const y = icon?.path[0].y || 0
            const lineX = line?.path[0].x || 0
            const lineY = line?.path[0].y || 0

            handle.down({ pageX: x, pageY: y, button: 0 } as any)
            handle.move({ movementX: 100, movementY: 100 } as any)
            handle.up({} as any)

            expect(stack.getItem('icon', 0)?.path[0])
                .toStrictEqual({ x: x + 100, y: y + 100 })

            expect(stack.getItem('line', 1)?.path[0])
                .toStrictEqual({ x: lineX + 100, y: lineY + 100 })
        })
    })

    test('rightButton to open menu is ok 右键打开菜单', () => {
        const item = stack.getItem('icon', 0)
        const x = item?.path[0].x
        const y = item?.path[0].y

        handle.menu({ pageX: x, pageY: y, button: 2 } as any)
        expect(store.getState().contextmenu.show).toBe(true)
        expect(store.getState().contextmenu.selectIndex).toBe(item?.index)
    })

    test('rightButton to open menu is not rightButton 左键尝试打开菜单', () => {
        const item = stack.getItem('icon', 0)
        const x = item?.path[0].x
        const y = item?.path[0].y

        handle.menu({ pageX: x, pageY: y, button: 0 } as any)
        expect(store.getState().contextmenu.show).toBe(false)
        expect(store.getState().contextmenu.selectIndex).toBe(null)
    })

    test('rightButton to open menu is not icon 右键打开不存在点元素', () => {
        handle.menu({ pageX: 800, pageY: 600, button: 2 } as any)
        expect(store.getState().contextmenu.show).toBe(false)
        expect(store.getState().contextmenu.selectIndex).toBe(null)
    })

    test('selected to resetEvent 选择并重置事件', () => {
        const item = stack.getItem('icon', 0)
        const x = item?.path[0].x
        const y = item?.path[0].y
        handle.menu({ pageX: x, pageY: y, button: 2 } as any)

        const newItem = stack.getItem('icon', 0)
        expect(newItem?.select).toBe(true)

        handle.resetEvent()
        const newItem2 = stack.getItem('icon', 0)
        expect(newItem2?.select).toBe(false)
        expect(store.getState().contextmenu.show).toBe(false)
        expect(store.getState().contextmenu.selectIndex).toBe(null)
    })

    test('delete line of 1 删除1个元素', () => {
        handle.delete(1)
        expect(stack.getItem('icon', 1)).toBeUndefined()
        expect(stack.getItem('line', 1)).toBeUndefined()
    })

    test('test destroy 销毁钩子', () => {
        const down = jest.fn()
        const move = jest.fn()
        const up = jest.fn()
        const menu = jest.fn()
        HandleEvent.prototype.move = move
        HandleEvent.prototype.down = down
        HandleEvent.prototype.up = up
        HandleEvent.prototype.menu = menu

        const mockHand = new HandleEvent
        mockHand.destroy()

        fireEvent.mouseDown(window)
        fireEvent.mouseMove(window)
        fireEvent.mouseUp(window)
        fireEvent.contextMenu(window)

        expect(down).toHaveBeenCalledTimes(0)
        expect(move).toHaveBeenCalledTimes(0)
        expect(up).toHaveBeenCalledTimes(0)
        expect(menu).toHaveBeenCalledTimes(0)
    })
})
