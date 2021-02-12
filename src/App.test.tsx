import React from 'react'
import { render } from '@testing-library/react'
import 'jest-canvas-mock'
import App from './App'


test('检测APP.tsx 是否存在line-canvas，icon-line', () => {
    const { container } = render(<App />)
    const canvasLen = container.querySelectorAll('canvas').length
    expect(canvasLen).toBe(2)

    const isLineCanvas = container.querySelector('.canvas-icon')?.tagName
    const isIconCanvas = container.querySelector('.canvas-line')?.tagName
    expect(isLineCanvas).toEqual('CANVAS')
    expect(isIconCanvas).toEqual('CANVAS')
})
