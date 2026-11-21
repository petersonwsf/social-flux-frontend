import type { Notificacao, NotificacaoTipo } from '../types/api'

const ACAO_SINGULAR: Record<NotificacaoTipo, string> = {
    LIKE: 'curtiu sua publicação',
    REPLY: 'respondeu sua publicação',
    FOLLOW: 'começou a seguir você',
    FOLLOW_REQUEST: 'pediu para seguir você',
    FOLLOW_ACCEPTED: 'aceitou sua solicitação de seguir',
}

const ACAO_PLURAL: Record<NotificacaoTipo, string> = {
    LIKE: 'curtiram sua publicação',
    REPLY: 'responderam sua publicação',
    FOLLOW: 'começaram a seguir você',
    FOLLOW_REQUEST: 'pediram para seguir você',
    FOLLOW_ACCEPTED: 'aceitaram sua solicitação de seguir',
}

/** "Ana", "Ana e Bia" ou "Ana, Bia e mais 3" (o servidor manda só os 2 atores mais recentes e o total). */
export function nomesDosAtores(notificacao: Pick<Notificacao, 'atores' | 'totalAtores'>): string {
    const nomes = notificacao.atores.map((ator) => ator.nome)
    const total = Math.max(notificacao.totalAtores, nomes.length)
    if (total <= 1 || nomes.length === 0) return nomes[0] ?? 'Alguém'
    if (total === 2) return nomes.length === 2 ? `${nomes[0]} e ${nomes[1]}` : `${nomes[0]} e mais 1`
    const resto = total - nomes.length
    return nomes.length === 1 ? `${nomes[0]} e mais ${resto}` : `${nomes[0]}, ${nomes[1]} e mais ${resto}`
}

/** A ação no singular ou no plural, conforme o total de pessoas do grupo. */
export function acaoDaNotificacao(notificacao: Pick<Notificacao, 'tipo' | 'totalAtores'>): string {
    return notificacao.totalAtores > 1 ? ACAO_PLURAL[notificacao.tipo] : ACAO_SINGULAR[notificacao.tipo]
}

/** A frase completa (ex.: "Ana, Bia e mais 3 curtiram sua publicação"), usada no toast. */
export function fraseDaNotificacao(notificacao: Notificacao): string {
    return `${nomesDosAtores(notificacao)} ${acaoDaNotificacao(notificacao)}`
}

/** Para onde a notificação leva: o perfil de quem agiu ou a postagem (a resposta, quando houver). */
export function destinoDaNotificacao(notificacao: Notificacao): string {
    const ator = notificacao.atores[0]
    switch (notificacao.tipo) {
        case 'FOLLOW':
        case 'FOLLOW_REQUEST':
        case 'FOLLOW_ACCEPTED':
            return ator ? `/perfil/${ator.username}` : '/'
        default: {
            const postagem = notificacao.resposta ?? notificacao.postagem
            return postagem ? `/postagem/${postagem}` : '/'
        }
    }
}
