import React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from '../../store'
import { handleEvent } from '../../plugins/engine/handle/handleEvent'
import './styles.scss'

const mapState = (state: RootState) => ({
    show: state.contextmenu.show,
    x: state.contextmenu.x,
    y: state.contextmenu.y,
    selectIndex: state.contextmenu.selectIndex
})

const mapDispatch = (dispatch: Dispatch) => ({
    hide: dispatch.contextmenu.hide
})

type StateProp = ReturnType<typeof mapState>
type DispatchProp = ReturnType<typeof mapDispatch>
type ContextProp = StateProp & DispatchProp

const ContextMenu: React.FC<ContextProp> = ({ show, x, y, selectIndex, hide }) => {
    if (show === false) return null

    const click = (even: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        even.stopPropagation()
        even.preventDefault()
        if (selectIndex !== null) handleEvent.delete(selectIndex)
        hide()
    }

    return (
        <div
            className="context-menu"
            onClick={click}
            onMouseDown={e => e.stopPropagation()}
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div className="item">删除</div>
        </div>
    )
}

export default connect(mapState, mapDispatch)(ContextMenu)
