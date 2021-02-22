import React from 'react'
import { Slider } from 'antd'
import './styles.scss'

interface MagnifierProp {
    onChange: (val: number) => void // eslint-disable-line no-unused-vars
    max: number
    min: number
    defaultValue: number
}

const Magnifier: React.FC<MagnifierProp> = ({ max, min, onChange, defaultValue }) => {
    return (
        <div className="Slider">
            <Slider max={max} min={min} onChange={onChange} defaultValue={defaultValue} />
        </div>
    )
}

export default Magnifier
