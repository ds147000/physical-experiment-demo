import React, { useCallback, useEffect, useState } from 'react'
import { Button, Layout, Modal } from 'antd'
import { SaveOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { RendererVC } from '../../plugins/renderer'
import { stack } from '../../plugins/engine/stack/stack'
import { SchedulerController } from '../../plugins/engine/scheduler'
import Menu from '../menu'
import logo from '../../assets/images/logo512.png'
import './styles.scss'

const { Header, Content, Sider } = Layout

const CLayout: React.FC = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)

    const onCollapse = useCallback(val => setCollapsed(val), [])

    const onSave = useCallback(() => {
        Modal.error({
            title: '提示',
            content: '保存功能正在开发中...'
        })
    }, [])
    const onClear = useCallback(() => {
        SchedulerController.run(() => {
            stack.set('icon', new Array(1000))
            stack.set('line', new Array(1000))
        })
    }, [])

    const onExport = useCallback(async () => {
        SchedulerController.runSingleIdle(async () => {
            const base64String = await RendererVC.export()
            const dom = document.createElement('a')
            dom.href = base64String
            dom.download = 'export.png'
            dom.click()
            return Promise.resolve()
        }, 'export')
    }, [])

    useEffect(() => {
        setTimeout(() => RendererVC.resetSize(), 600)
    }, [collapsed])

    return (
        <Layout className="layout">
            <Layout >
                <Header className="header">
                    <Button type="primary" onClick={onSave} >
                        <SaveOutlined />保存
                    </Button>
                    <Button type="primary" onClick={onExport} >
                        <FileTextOutlined />导出图片
                    </Button>
                    <Button danger={true} onClick={onClear} type="primary" >
                        <ExclamationCircleOutlined />清空
                    </Button>
                </Header>
                <Content className="content">
                    {children}
                </Content>
            </Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo" >
                    <img src={logo} />
                    {  !collapsed && <h1>物理实验demo</h1>}
                </div>
                <Menu />
            </Sider>
        </Layout>
    )
}

export default CLayout
