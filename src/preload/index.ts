import { contextBridge, ipcRenderer } from 'electron'
import { ipcMethods } from './ipcMethods'

// Custom APIs for renderer
// eslint-disable-next-line @typescript-eslint/ban-types
const api: { [fn: string]: Function } = {}
for (const methodName in ipcMethods) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api[methodName] = (...args: any[]): any => ipcRenderer.invoke(methodName, ...args)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api['chooseDirectory'] = (...args: any): any => ipcRenderer.invoke('chooseDirectory', ...args)

contextBridge.exposeInMainWorld('api', api)
