import { api } from '../lib/api'
import type {
    ContagensRelacao,
    EmComum,
    EstadoRelacao,
    PaginaRelacoes,
    PaginaSolicitacoes,
    RelacaoComUsuario,
} from '../types/api'

/**
 * social_graph_service (`/api/relacoes`). O usuário logado vem sempre do token: aqui só se informa o ALVO da ação.
 * `idUsuario` é o UUID da conta (o único id de usuário do sistema).
 */

export async function buscarEstado(idUsuario: string): Promise<RelacaoComUsuario> {
    const { data } = await api.get<RelacaoComUsuario>(`/api/relacoes/${idUsuario}/estado`)
    return data
}

export async function buscarContagens(idUsuario: string): Promise<ContagensRelacao> {
    const { data } = await api.get<ContagensRelacao>(`/api/relacoes/${idUsuario}/contagens`)
    return data
}

/** Conta pública: passa a seguir na hora (`SEGUINDO`). Conta privada: cria a solicitação (`SOLICITADO`). */
export async function seguir(idUsuario: string): Promise<EstadoRelacao> {
    const { data } = await api.put<{ estado: EstadoRelacao }>(`/api/relacoes/seguindo/${idUsuario}`)
    return data.estado
}

/** Deixa de seguir OU cancela a solicitação pendente. */
export async function deixarDeSeguir(idUsuario: string): Promise<void> {
    await api.delete(`/api/relacoes/seguindo/${idUsuario}`)
}

/** Tira um seguidor da lista do usuário logado. */
export async function removerSeguidor(idUsuario: string): Promise<void> {
    await api.delete(`/api/relacoes/seguidores/${idUsuario}`)
}

export async function listarSeguidores(idUsuario: string, cursor?: string): Promise<PaginaRelacoes> {
    const { data } = await api.get<PaginaRelacoes>(`/api/relacoes/${idUsuario}/seguidores`, { params: { cursor } })
    return data
}

export async function listarSeguidos(idUsuario: string, cursor?: string): Promise<PaginaRelacoes> {
    const { data } = await api.get<PaginaRelacoes>(`/api/relacoes/${idUsuario}/seguidos`, { params: { cursor } })
    return data
}

/** Quem o usuário logado segue e também segue `idUsuario`. `limite` (1–100) restringe os itens; `total` é sempre o real. */
export async function buscarEmComum(idUsuario: string, limite?: number): Promise<EmComum> {
    const { data } = await api.get<EmComum>(`/api/relacoes/${idUsuario}/em-comum`, { params: { limite } })
    return data
}

/** Solicitações de seguir RECEBIDAS pelo usuário logado, com o total de pendentes. */
export async function listarSolicitacoes(cursor?: string): Promise<PaginaSolicitacoes> {
    const { data } = await api.get<PaginaSolicitacoes>('/api/relacoes/solicitacoes', { params: { cursor } })
    return data
}

export async function aceitarSolicitacao(idSolicitante: string): Promise<void> {
    await api.post(`/api/relacoes/solicitacoes/${idSolicitante}/aceitar`)
}

export async function recusarSolicitacao(idSolicitante: string): Promise<void> {
    await api.delete(`/api/relacoes/solicitacoes/${idSolicitante}`)
}
