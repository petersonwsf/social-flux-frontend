import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap' // JS do Bootstrap: ativa modais, dropdowns etc. via data-bs-*
import App from './App'
import { AuthProvider } from './contexts/AuthProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { ToastProvider } from './contexts/ToastProvider'
import { registerIcons } from './lib/icons'
import './styles/theme.css'
import './styles/components.css'

registerIcons()

const container = document.getElementById('root')
if (!container) throw new Error('Elemento #root não encontrado')

createRoot(container).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <ToastProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ToastProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
)
