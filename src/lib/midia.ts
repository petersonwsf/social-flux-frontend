/**
 * Regras de anexo de postagem conferidas no CLIENTE só por conveniência (o post_service valida de novo e é quem decide):
 * PNG, JPEG e WebP até 5 MB; GIF (animado) até 8 MB. Texto até 1.000 caracteres.
 */
export const TIPOS_ACEITOS = 'image/png,image/jpeg,image/webp,image/gif'
export const MAX_LEGENDA = 1000

const MB = 1024 * 1024
const MAX_IMAGEM = 5 * MB
const MAX_GIF = 8 * MB
const TIPOS = new Set(TIPOS_ACEITOS.split(','))

/** Mensagem de erro para o arquivo escolhido, ou `null` se parece aceitável. */
export function validarAnexo(arquivo: File | null): string | null {
    if (!arquivo) return null
    if (arquivo.type && !TIPOS.has(arquivo.type)) return 'Envie uma imagem PNG, JPEG, WebP ou um GIF'
    const limite = arquivo.type === 'image/gif' ? MAX_GIF : MAX_IMAGEM
    if (arquivo.size > limite) return arquivo.type === 'image/gif' ? 'O GIF pode ter até 8 MB' : 'A imagem pode ter até 5 MB'
    return null
}

/** Texto e/ou anexo: pelo menos um dos dois. */
export function temConteudo(legenda: string, arquivo: File | null): boolean {
    return legenda.trim().length > 0 || arquivo !== null
}
