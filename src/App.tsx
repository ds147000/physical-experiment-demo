import React, { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { Spin } from 'antd'
import { RendererVC } from './plugins/renderer'
import { IconVC, LineVC } from './plugins/engine/scenes'
import { store } from './store'
import Layout from './components/layout'
import ContextMenu from './components/contxtmenu'
// import Magnifier from './components/magnifier'
import './App.scss'

const App: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const canvasLienRef = useRef<HTMLCanvasElement>(null)
    const canvasIconRef = useRef<HTMLCanvasElement>(null)


    // 初始化应用
    useEffect(() => {
        RendererVC.loading = () => setLoading(true)
        RendererVC.hideLoading = () => setLoading(false)

        if (canvasIconRef.current === null || canvasLienRef.current === null) return

        IconVC.init(canvasIconRef.current)
        LineVC.init(canvasLienRef.current)
        RendererVC.init(canvasLienRef.current, canvasIconRef.current)

    }, [canvasIconRef, canvasLienRef])

    // const onChange = useCallback((val: number) => RendererVC.sacle(val), [])

    return (
        <Provider store={store} >
            <div className="App">
                <ContextMenu />
                {/* <Magnifier min={0} max={200} defaultValue={100} onChange={onChange} /> */}
                <Layout>
                    <Spin spinning={loading} >
                        <div className="canvas">
                            <canvas className="canvas-icon" ref={canvasIconRef} />
                            <canvas className="canvas-line" ref={canvasLienRef} />
                        </div>
                    </Spin>
                </Layout>
            </div>
        </Provider>
    )
}

export default App
