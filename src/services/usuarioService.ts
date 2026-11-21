import { api } from '../lib/api'
import type { EditarPerfilPayload, Usuario } from '../types/api'

/** Perfil do usuário logado (inclui dados pessoais, que só o dono vê). */
export async function meuPerfil(): Promise<Usuario> {
    const { data } = await api.get<Usuario>('/api/usuarios/me')
    return data
}

export async function buscarPorUsername(username: string): Promise<Usuario> {
    const { data } = await api.get<Usuario>('/api/usuarios', { params: { username } })
    return data
}

export async function pesquisar(search: string): Promise<Usuario[]> {
    const { data } = await api.get<Usuario[]>('/api/usuarios/search', { params: { search } })
    return data
}

/** Devolve o perfil atualizado. */
export async function editarPerfil(id: string, payload: EditarPerfilPayload): Promise<Usuario> {
    const { data } = await api.patch<Usuario>(`/api/usuarios/${id}`, payload)
    return data
}

/** Devolve o perfil com a nova foto (o servidor ignora qualquer nome de foto antiga: ele conhece a atual). */
export async function atualizarFotoPerfil(id: string, foto: File): Promise<Usuario> {
    const formData = new FormData()
    formData.append('foto_perfil', foto)

    const { data } = await api.patch<Usuario>(`/api/img/usuarios/${id}`, formData)
    return data
}
