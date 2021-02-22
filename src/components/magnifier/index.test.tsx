import { fireEvent, render } from '@testing-library/react'
import Magnifier from './index'

test('test render', () => {
    const onChange = jest.fn(val => val)
    const max = 200
    const min = 100
    const { getByRole } = render(<Magnifier max={max} min={min} onChange={onChange} />)
    const slider = getByRole('slider')
    fireEvent.mouseDown(slider)
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange.mock.results[0].value).toBe(0)
})
