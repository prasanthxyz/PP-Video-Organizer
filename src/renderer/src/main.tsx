import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'

import 'rsuite/dist/rsuite.min.css'
import './assets/index.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
