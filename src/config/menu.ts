import LineImg from '../assets/images/line.png'
import DCImg from '../assets/images/dc.png'
import DPImg from '../assets/images/dp.png'
import KGImg from '../assets/images/kg.png'

export type ITEM_TYPES = 'icon' | 'line'

interface Point {
    x: number
    y: number
}

interface Config {
    /** @public 元素真实宽度 */
    width: number
    /** @public 元素真实高度 */
    height: number
    /** @public 元素链接点 */
    points?: Point[]
}

export interface MenuListItem {
    id: number
    /** @public 类型 */
    type: ITEM_TYPES
    /** @public 图标地址 */
    url: string
    /** @public 标题 */
    title: string
    /** @public 配置信息 */
    config: Config
}

export const MenuList: MenuListItem[] = [
    {
        id: 0,
        type: 'line',
        url: LineImg,
        title: '导线',
        config: {
            width: 68,
            height: 8,
            points: [
                { x: 0, y: 4 },
                { x: 68, y: 4}
            ]
        }
    },
    {
        id: 1,
        type: 'icon',
        url: DCImg,
        title: '电池',
        config: {
            width: 69,
            height: 28,
            points: [
                { x: 0, y: 14 },
                { x: 69, y: 14 }
            ]
        }
    },
    {
        id: 2,
        type: 'icon',
        url: DPImg,
        title: '灯泡',
        config: {
            width: 52,
            height: 70,
            points: [
                { x: 7, y: 62 },
                { x: 41, y: 62 }
            ]
        }
    },
    {
        id: 3,
        type: 'icon',
        url: KGImg,
        title: '开关',
        config: {
            width: 82,
            height: 48,
            points: [
                { x: 14, y: 36 },
                { x: 66, y: 36 }
            ]
        }
    }
]
