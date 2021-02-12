import { createModel } from '@rematch/core'
import { RootModel } from './index'

interface ShowPayload {
    show: boolean,
    x: number,
    y: number,
    selectIndex: null | number
}

export const contextmenu = createModel<RootModel>()({
    state: {
        show: false,
        x: 0,
        y: 0,
        selectIndex: null
    } as ShowPayload,

    reducers: {
        show(_, payload: ShowPayload) {
            return { ...payload }
        },
        hide() {
            return {x: 0, y: 0, selectIndex: null, show: false}
        }
    }
})
