import { stack, outputStack, StackItem } from './stack'
import { MenuListItem } from '../../../config/menu'

describe('test the stack', () => {
    const emit = jest.fn()

    test('sub', () => {
        stack.subscription(emit)
    })

    test('push', () => {
        const item: MenuListItem = {
            url: '',
            title: 'test',
            id: 0,
            type: 'icon',
            config: {
                width: 40,
                height: 40,
                points: [{ x: 0, y: 0 }]
            }
        }
        const index = stack.push(item, 0, 0)
        expect(emit.mock.calls[0][0]).toBe('icon')
        expect(index).toBe(0)

        const itemLine: MenuListItem = {
            url: '',
            title: 'test',
            id: 0,
            type: 'line',
            config: {
                width: 80,
                height: 8,
                points: [{ x: 0, y: 4 }, { x: 80, y: 4 }]
            }
        }
        const index2 = stack.push(itemLine, 0, 400)
        expect(emit.mock.calls[1][0]).toBe('line')
        expect(index2).toBe(1)
    })

    test('get', () => {
        const iconList = stack.get('icon')
        expect(iconList.length).toBe(1000)
        expect(iconList[0]).not.toBe(undefined)
        expect(iconList[1]).toBe(undefined)

        const lineList = stack.get('line')
        expect(lineList.length).toBe(1000)
        expect(lineList[1]).not.toBe(undefined)
        expect(lineList[0]).toBe(undefined)
    })

    test('getItem', () => {
        const item = stack.getItem('icon', 0)
        const item2 = stack.getItem('line', 0)
        expect(item?.id).not.toBe(undefined)
        expect(item2).toBe(undefined)
    })

    test('setItem', () => {
        const item: StackItem = outputStack(
            0,
            0,
            'icon',
            50,
            50,
            40,
            40,
            [{ x: 0, y: 0 }]
        )
        stack.setItem('icon', 0, item)

        const queryItem = stack.getItem('icon', 0)
        expect(queryItem?.path[0].x === 50 && queryItem.path[0].y === 50).toBe(true)

        stack.setItem('line', 1, undefined)
        const queryLien = stack.getItem('line', 1)
        expect(queryLien).toBe(undefined)
    })

    test('double', () => {
        for(let i = 0; i < 1001; i ++) {
            const item: MenuListItem = {
                url: '',
                title: 'test',
                id: i,
                type: 'icon',
                config: {
                    width: 40,
                    height: 40,
                    points: [{ x: 0, y: 0 }]
                }
            }
            stack.push(item, 500, 500)
        }
        expect(stack.get('icon').length).toBe(2000)
        expect(stack.get('line').length).toBe(2000)
    })

    test('connecting', () => {
        const iconItem: MenuListItem = {
            url: '',
            title: 'icon2',
            id: Math.random(),
            type: 'icon',
            config: {
                width: 50,
                height: 50,
                points: [{ x: 0, y: 0 }]
            }
        }
        const iconOfindex = stack.push(iconItem, 300, 300)

        const item: MenuListItem = {
            url: '',
            title: 'line-test',
            id: Math.random(),
            type: 'line',
            config: {
                width: 40,
                height: 8,
                points: [ { x: 0, y: 4 }, { x: 40, y: 4 }]
            }
        }
        const index = stack.push(item, 150, 150)
        const line = stack.getItem('line', index)
        expect(line).not.toBe(undefined)

        if (line) {
            line.path[0] = { x: 50, y: 50 }
            line.path[1] = { x: 300, y: 300 }
            stack.setItem('line', index, line)
            stack.lienConncetIcon(index)

            const iconItem = stack.getItem('icon', 0)
            expect(iconItem?.connect[0].index).toBe(index)

            const iconItem2 = stack.getItem('icon', iconOfindex)
            expect(iconItem2?.connect[0].index).toBe(index)

            line.path[0] = { x: 0, y: 0 }
            line.path[1] = { x: 200, y: 200 }
            stack.setItem('line', index, line)
            stack.lienConncetIcon(index)

            const newIconItem = stack.getItem('icon', 0)
            const newIconItem2 = stack.getItem('icon', iconOfindex)
            expect(newIconItem?.connect.length).toBe(0)
            expect(newIconItem2?.connect.length).toBe(0)
        }

    })
})
