import { createContext } from 'react'
import type { Mensagem, Notificacao } from '../types/api'

export interface ToastContextValue {
    success: (text: string) => void
    error: (text: string) => void
    /** Exibe uma resposta padrão do backend ({ mensagem, sucesso }). */
    notify: (mensagem: Mensagem) => void
    /** Exibe a mensagem de apoio emocional (com CVV 188 e link), que fica na tela por mais tempo que um toast comum. */
    apoio: (text: string) => void
    /** Exibe uma notificação em tempo real (foto, ícone do tipo e frase), em vez de uma mensagem de texto. */
    notificar: (notificacao: Notificacao) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
