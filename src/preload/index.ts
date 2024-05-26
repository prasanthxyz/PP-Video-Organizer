import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
// eslint-disable-next-line @typescript-eslint/ban-types
const api: { [fn: string]: Function } = {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api['chooseDirectory'] = (...args: any): any => ipcRenderer.invoke('chooseDirectory', ...args)

contextBridge.exposeInMainWorld('api', api)
