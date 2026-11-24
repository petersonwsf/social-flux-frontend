import { createContext } from 'react'
import type { Mensagem, Notificacao } from '../types/api'

export interface ToastContextValue {
    success: (text: string) => void
    error: (text: string) => void
    /** Exibe uma resposta padrão do backend ({ mensagem, sucesso }). */
    notify: (mensagem: Mensagem) => void
    /** Exibe uma notificação em tempo real (foto, ícone do tipo e frase), em vez de uma mensagem de texto. */
    notificar: (notificacao: Notificacao) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
