import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initMobileAntiZoomLock } from './services/preventZoom'

// Inicializa bloqueio estrito de zoom para experiência de app nativo
initMobileAntiZoomLock();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

