import { api } from '../lib/api'
import type { PaginaNotificacoes } from '../types/api'

/**
 * notification_service (`/api/notificacoes`). O usuário vem sempre do token e as notificações são geradas pelo servidor a
 * partir dos eventos (curtir, responder, seguir…): o frontend só lê, marca como vistas e recebe o tempo real
 * (`lib/notificacoesStream.ts`).
 */

export async function listar(cursor?: string): Promise<PaginaNotificacoes> {
    const { data } = await api.get<PaginaNotificacoes>('/api/notificacoes', { params: { cursor } })
    return data
}

interface OpcoesContagem {
    /** Não renova a sessão nem repete a chamada em 401 (usado pela sonda do tempo real: ela nunca mantém a sessão viva). */
    semRenovar?: boolean
}

/** Total de notificações não vistas (limitado a 100: a tela mostra "99+"). */
export async function contarNaoVistas(opcoes: OpcoesContagem = {}): Promise<number> {
    const { data } = await api.get<{ total: number }>('/api/notificacoes/nao-vistas', {
        skipSessionRefresh: opcoes.semRenovar === true,
    })
    return data.total
}

/** Marca como vistas as notificações até o `seq` informado (o maior que a tela exibiu); as mais novas continuam novas. */
export async function marcarComoVistas(ate: number): Promise<void> {
    await api.post('/api/notificacoes/vistas', { ate })
}
