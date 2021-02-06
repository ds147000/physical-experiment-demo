import { Models } from '@rematch/core'
import { contextmenu } from './contextmenu'

export interface RootModel extends Models<RootModel> {
    contextmenu: typeof contextmenu
}

export const models: RootModel = { contextmenu }
