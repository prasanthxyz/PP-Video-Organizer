declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    api: { [fn: string]: Function }
  }
}

export {}
