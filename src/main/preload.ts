import { contextBridge, ipcRenderer } from 'electron';
import { ipcMethods } from '../ipcMethods';

// Custom APIs for renderer
const api: { [fn: string]: Function } = {};
for (const methodName in ipcMethods) {
  api[methodName] = (...args: any[]) => ipcRenderer.invoke(methodName, ...args);
}

api['chooseDirectory'] = (...args: any) =>
  ipcRenderer.invoke('chooseDirectory', ...args);

contextBridge.exposeInMainWorld('api', api);

export type ElectronHandler = typeof api;
