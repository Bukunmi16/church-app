import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from './components/ui/sonner'
import ScrollToTop from './components/layout.jsx/ScrollToTop'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop/>
    {/* <Toaster?/> */}
    <App />
    </BrowserRouter>
  </StrictMode>,
)
