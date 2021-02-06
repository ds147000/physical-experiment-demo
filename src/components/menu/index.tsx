import React, { useCallback } from 'react'
import { MeunList } from '../../config/menu'
import { handleEvent } from '../../plugins/engine/handle/handleEvent'
import './styles.scss'

interface ItemProp {
    onActive: () => void
    url: string
    title: string
}

const Item: React.FC<ItemProp> = ({ onActive, url, title }) => {
    const select = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        event.preventDefault()
        onActive()
    }

    return (
        <div className="item" onMouseDown={select}>
            <img className="icon" src={url} />
            <span>{title}</span>
            <div className="mask" />
        </div>
    )
}

const Menu: React.FC = () => {

    const onActive = useCallback((id: number) => {
        handleEvent.setActive(id)
    }, [])

    return (
        <div className="menu">
            {MeunList.map(item => (
                <Item
                    key={item.id}
                    url={item.url}
                    title={item.title}
                    onActive={() => onActive(item.id)}
                />)
            )}
        </div>
    )
}

export default Menu
