/**
 * Insere o emoji na posição do cursor do campo (ou no fim, se não houver campo), chama `atualizar` com o novo
 * texto e devolve o foco ao campo com o cursor logo após o emoji.
 */
export function inserirEmojiNoCampo(
    campo: HTMLTextAreaElement | null,
    atual: string,
    emoji: string,
    atualizar: (texto: string) => void,
): void {
    const inicio = campo?.selectionStart ?? atual.length
    const fim = campo?.selectionEnd ?? atual.length
    atualizar(atual.slice(0, inicio) + emoji + atual.slice(fim))
    window.requestAnimationFrame(() => {
        campo?.focus()
        campo?.setSelectionRange(inicio + emoji.length, inicio + emoji.length)
    })
}
