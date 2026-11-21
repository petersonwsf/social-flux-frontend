import { api } from '../lib/api'
import type { CriarPostagemPayload, EstadoCurtida, PaginaPostagens, Postagem } from '../types/api'

export type FiltroPostagensUsuario = 'posts' | 'interacoes' | 'midia'

const BASE = '/api/postagens'

/** Cria uma postagem ou, com `idPai`, uma resposta. Texto e/ou imagem (PNG, JPEG, WebP ou GIF). */
export async function criar(values: CriarPostagemPayload, idPai?: string): Promise<Postagem> {
    const formData = new FormData()
    if (values.legenda.trim()) formData.append('legenda', values.legenda)
    if (values.imagem) formData.append('imagem', values.imagem)
    if (idPai !== undefined) formData.append('pai', idPai)

    const { data } = await api.post<Postagem>(BASE, formData)
    return data
}

export async function remover(id: string): Promise<void> {
    await api.delete(`${BASE}/${id}`)
}

export async function buscar(id: string): Promise<Postagem> {
    const { data } = await api.get<Postagem>(`${BASE}/${id}`)
    return data
}

export async function buscarRespostas(id: string, cursor?: string): Promise<PaginaPostagens> {
    const { data } = await api.get<PaginaPostagens>(`${BASE}/${id}/respostas`, { params: { cursor } })
    return data
}

/** Cadeia de pais de uma resposta, da mais antiga à mais próxima (até 10 níveis, só as visíveis). */
export async function buscarAncestrais(id: string): Promise<Postagem[]> {
    const { data } = await api.get<{ itens: Postagem[] }>(`${BASE}/${id}/ancestrais`)
    return data.itens
}

/** Postagens das pessoas que o usuário logado segue. */
export async function buscarFeed(cursor?: string): Promise<PaginaPostagens> {
    const { data } = await api.get<PaginaPostagens>(`${BASE}/feed`, { params: { cursor } })
    return data
}

/** Postagens de um usuário (`autor` = UUID da conta). */
export async function buscarDoUsuario(
    autor: string,
    filtro: FiltroPostagensUsuario,
    cursor?: string,
): Promise<PaginaPostagens> {
    const { data } = await api.get<PaginaPostagens>(BASE, { params: { autor, filtro, cursor } })
    return data
}

export async function curtir(id: string): Promise<EstadoCurtida> {
    const { data } = await api.put<EstadoCurtida>(`${BASE}/${id}/curtida`)
    return data
}

export async function descurtir(id: string): Promise<EstadoCurtida> {
    const { data } = await api.delete<EstadoCurtida>(`${BASE}/${id}/curtida`)
    return data
}
