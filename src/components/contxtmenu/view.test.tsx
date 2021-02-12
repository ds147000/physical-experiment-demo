import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import ContextMenu, { ContextProp } from './view'
import { stack } from '../../plugins/engine/stack/stack'
import { HandleEvent } from '../../plugins/engine/handle/handleEvent'

const hide: any = () => {}

const contentProps: ContextProp = {
    x: 0,
    y: 0,
    selectIndex: 0,
    hide,
    show: true
}

test('test the 右键菜单显示，contextmenu.tsx', async () => {
    const { container } = render(<ContextMenu {...contentProps} show={true}  />)

    const isShow = await container.querySelectorAll('.context-menu').length

    expect(isShow).toBe(1)
})

test('test the 右键菜单隐藏，contextmenu.tsx', async () => {
    const { container } = render(<ContextMenu {...contentProps} show={false}  />)

    const isShow = await container.querySelectorAll('.context-menu').length

    expect(isShow).toBe(0)
})

test('test the 右键菜单删除事件，contextmenu.tsx', async () => {
    const hide: any = jest.fn()
    const onDelete = jest.fn()

    stack.subscription(onDelete)
    const renderer = render(<ContextMenu {...contentProps} hide={hide} />)
    fireEvent.click(renderer.getByText('删除'))

    expect(hide).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledTimes(2)
})

test('test the 右键菜单删除错误事件', () => {
    HandleEvent.prototype.delete = jest.fn()
    const handle = new HandleEvent
    const contextMenu = render(<ContextMenu {...contentProps} selectIndex={null} />)
    fireEvent.click(contextMenu.getByText('删除'))
    expect(handle.delete).toHaveBeenCalledTimes(0)
})

test('test the mousedown 测试菜单事件阻止冒泡', () => {
    HandleEvent.prototype.down = jest.fn()
    const handle = new HandleEvent
    const { getByText } = render(<ContextMenu {...contentProps} ></ContextMenu>)

    fireEvent.mouseDown(getByText('删除'))
    expect(handle.down).toHaveBeenCalledTimes(0)
})
