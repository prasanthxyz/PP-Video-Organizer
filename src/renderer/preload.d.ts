import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    api: ElectronHandler;
  }
}

export {};
