import { connect } from 'react-redux'
import { RootState, Dispatch } from '../../store'


const mapState = (state: RootState) => ({
    show: state.contextmenu.show,
    x: state.contextmenu.x,
    y: state.contextmenu.y,
    selectIndex: state.contextmenu.selectIndex
})

const mapDispatch = (dispatch: Dispatch) => ({
    hide: dispatch.contextmenu.hide
})

export type StateProp = ReturnType<typeof mapState>
export type DispatchProp = ReturnType<typeof mapDispatch>


export const MenuConnect = connect(mapState, mapDispatch)
