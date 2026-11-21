import type { Usuario, UsuarioResumo } from '../types/api'

/** O conteúdo é do usuário logado? Compara pelo UUID da conta. */
export function ehDoUsuario(autor: UsuarioResumo, user: Usuario): boolean {
    return autor.id === user.id
}
