import { createContext } from 'react'
import type { Notificacao } from '../types/api'

export interface NotificationsContextValue {
    notificacoes: Notificacao[]
    /** Notificações não vistas (limitado a 100: mostre "99+"). Fica 0 enquanto a área de notificações está aberta. */
    naoVistas: number
    temMais: boolean
    carregando: boolean
    carregarMais: () => void
    /** Zera o contador do badge imediatamente (ao abrir a lista). */
    zerarContador: () => void
    /** Marca como vistas, no servidor, as notificações exibidas (ao sair da lista). */
    marcarComoVistas: () => void
    /**
     * A tela de notificações (página ou painel lateral) chama ao abrir e usa o retorno ao fechar: enquanto há uma aberta, o
     * badge fica zerado e não aparece toast (D14).
     */
    abrirArea: () => () => void
    aceitarSolicitacao: (notificacao: Notificacao) => Promise<void>
    recusarSolicitacao: (notificacao: Notificacao) => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)
