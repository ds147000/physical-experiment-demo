import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MenuList } from '../../config/menu'
import { handleEvent } from '../../plugins/engine/handle/handleEvent'
import Menu, { Item } from './view'

test('test the menu 元素菜单列表一致性 ', async () => {
    const length = MenuList.length
    const { findAllByRole } = render(<Menu />)

    const rendererItemLen = (await findAllByRole('item')).length

    expect(length === rendererItemLen).toBe(true)

    const renderItemList = await findAllByRole('item')
    const notIdentical = renderItemList.findIndex((item, key) => {
        const { title } = MenuList[key]
        const inTitle = new RegExp(title).test(item.innerHTML)
        if (!inTitle) return true
    })

    expect(notIdentical).toBe(-1)
})

test('test the menu 元素激活事件', async () => {
    const { findAllByRole } = render(<Menu />)

    // 随机选项
    const anyItemIndex = Math.floor(Math.random() * MenuList.length)
    const selectId = MenuList[anyItemIndex].id

    const ItemList = await findAllByRole('item')
    const selectItem = ItemList[anyItemIndex]

    fireEvent.mouseDown(selectItem)

    expect(handleEvent.getActive()).toBe(selectId)
})

test('test the menuItem 菜单元素激活', async () => {
    const onActive = jest.fn()
    const url = 'http://xxx.com'
    const title = '导线'

    const { container, getByText, getByRole } = render(<Item onActive={onActive} url={url} title={title} />)

    getByText(title)
    const inUrl = new RegExp(url).test(container.innerHTML)
    expect(inUrl).toBe(true)

    fireEvent.mouseDown(getByRole('item'))

    expect(onActive).toHaveBeenCalledTimes(1)
})
