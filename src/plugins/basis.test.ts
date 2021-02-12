import Basis from './basis'

describe('test the Classs of RenderBasis', () => {
    const basis = new Basis

    test('set loading fun', () => {
        const loading = jest.fn(() => true)
        basis.loading = loading
        basis.loading()
        expect(loading).toHaveBeenCalledTimes(1)
    })

    test('set hideLoading fun', () => {
        const hideLoading = jest.fn(() => false)
        basis.hideLoading = hideLoading
        basis.hideLoading()
        expect(hideLoading).toHaveBeenCalledTimes(1)
    })

    test('test clear fun', () => {
        basis.clear()
    })

    test('test save fun', async () => {
        const result = await basis.save()
        expect(result).toBe(true)
    })

    test('test export fun', async () => {
        const result = await basis.export()
        expect(result).toBe(true)
    })
})
