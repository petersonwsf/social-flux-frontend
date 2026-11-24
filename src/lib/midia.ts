/**
 * Regras de anexo de postagem conferidas no CLIENTE só por conveniência (o post_service valida de novo e é quem decide):
 * até 5 imagens (PNG, JPEG, WebP) de até 5 MB cada, ou um único GIF (animado) de até 8 MB. Texto até 1.000 caracteres.
 */
export const TIPOS_ACEITOS = 'image/png,image/jpeg,image/webp,image/gif'
export const MAX_LEGENDA = 1000
export const MAX_IMAGENS = 5

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

/** Mensagem de erro para o conjunto de anexos (quantidade, GIF sozinho e cada arquivo), ou `null`. */
export function validarAnexos(arquivos: File[]): string | null {
    if (arquivos.length > MAX_IMAGENS) return `Envie no máximo ${MAX_IMAGENS} imagens`
    if (arquivos.length > 1 && arquivos.some((arquivo) => arquivo.type === 'image/gif')) {
        return 'Um GIF não pode ser enviado junto com outras imagens'
    }
    for (const arquivo of arquivos) {
        const erro = validarAnexo(arquivo)
        if (erro) return erro
    }
    return null
}

/** Texto e/ou anexos: pelo menos um dos dois. */
export function temConteudo(legenda: string, arquivos: File[]): boolean {
    return legenda.trim().length > 0 || arquivos.length > 0
}
