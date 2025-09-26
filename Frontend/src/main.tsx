import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Provider from './Provider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
