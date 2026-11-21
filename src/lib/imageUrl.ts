import { API_URL } from '../config/env'

/**
 * URL da foto de perfil a partir da chave (`av_<uuid>.jpg`), servida pelo profile_service em /media/avatars (pública e
 * imutável). Imagens de postagem já vêm com a URL pronta em `postagem.imagem.url` (/media/posts/…, autenticada).
 */
export function getAvatarUrl(chave: string): string {
    return `${API_URL}/media/avatars/${chave}`
}

/** URL de uma imagem de postagem (`imagem.url` é relativa à origem da API). */
export function getPostImageUrl(url: string): string {
    return `${API_URL}${url}`
}
