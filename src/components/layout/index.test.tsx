import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { stack } from '../../plugins/engine/stack/stack'
import Layout from './index'

describe('test the Laytou.tex 测试Layout组件', () => {

    test('插入子节点功能 ', async () => {
        const LayoutRender = render(<Layout children={<>我是子节点</>} ></Layout>)
        const children = await LayoutRender.findByText('我是子节点')
        expect(children).toBeTruthy()
    })

    test('保存功能', async () => {
        const renderer = render(<Layout />)
        const saveButton = renderer.getByText('保存')
        expect(saveButton).toBeTruthy()

        fireEvent.click(saveButton)

    })

    test('清空功能', async () => {
        const renderer = render(<Layout />)

        const changeCallBack = jest.fn()
        stack.subscription(changeCallBack)

        const clearButton = renderer.getByText('清空')
        expect(clearButton).toBeTruthy()
        fireEvent.click(clearButton)

        expect(changeCallBack).toHaveBeenCalledTimes(2)
    })

    test('导出功能', async () => {
        const renderer = render(<Layout />)

        const exprotButton = renderer.getByText('导出图片')
        expect(exprotButton).toBeTruthy()
    })

    test('收起菜单功能', async () => {
        const renderer = render(<Layout />)

        const collapsedButton = renderer.container.querySelector('.ant-layout-sider-trigger')

        expect(collapsedButton).not.toBe(null)

        if (collapsedButton)
            fireEvent.click(collapsedButton)

    })
})
