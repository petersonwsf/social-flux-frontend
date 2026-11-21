/** Datas da API em ISO-8601 (UTC). Data inválida vira "agora" para não quebrar a tela. */
function toDate(iso: string): Date {
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? new Date() : date
}

/** Tempo relativo curto (ex.: "5 min", "2 h", "3 d") ou a data para posts com mais de uma semana. */
export function calcTempPost(iso: string): string {
    const date = toDate(iso)
    const diffSeconds = (Date.now() - date.getTime()) / 1000
    const diffMinutes = diffSeconds / 60
    const diffHours = diffMinutes / 60
    const diffDays = diffHours / 24

    if (diffSeconds < 60) return `${Math.max(0, Math.floor(diffSeconds))} seg`
    if (diffMinutes < 60) return `${Math.floor(diffMinutes)} min`
    if (diffHours < 24) return `${Math.floor(diffHours)} h`
    if (diffDays < 7) return `${Math.floor(diffDays)} d`
    return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatDate(iso: string): string {
    return toDate(iso).toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}
