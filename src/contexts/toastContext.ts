import { createContext } from 'react'
import type { Mensagem } from '../types/api'

export interface ToastContextValue {
    success: (text: string) => void
    error: (text: string) => void
    /** Exibe uma resposta padrão do backend ({ mensagem, sucesso }). */
    notify: (mensagem: Mensagem) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
