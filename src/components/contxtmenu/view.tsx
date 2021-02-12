import React, { useCallback } from 'react'
import { StateProp, DispatchProp } from './connect'
import { handleEvent } from '../../plugins/engine/handle/handleEvent'
import './styles.scss'

export type ContextProp = StateProp & DispatchProp

const ContextMenu: React.FC<ContextProp> = ({ show, x, y, selectIndex, hide }) => {
    const mosueDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.stopPropagation()
    }, [])

    const click = (even: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        even.stopPropagation()
        even.preventDefault()
        if (selectIndex !== null) handleEvent.delete(selectIndex)
        hide()
    }

    if (show === false) return null

    return (
        <div
            className="context-menu"
            onMouseDown={mosueDown}
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div className="item" onClick={click} >删除</div>
        </div>
    )
}

export default ContextMenu
