/* eslint-disable no-empty-function */

class RendererBasis {
    loading(): void {}
    hideLoading(): void {}
    /** 清空 */
    clear(): void {}
    /** 保存 */
    save(): Promise<boolean> {
        return Promise.resolve(true)
    }
    /** 导出 */
    export(): Promise<boolean> {
        return Promise.resolve(true)
    }
}

export default RendererBasis
