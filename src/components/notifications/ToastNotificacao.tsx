import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import { acaoDaNotificacao, destinoDaNotificacao, nomesDosAtores } from '../../lib/notificacoesTexto'
import type { Notificacao, NotificacaoTipo } from '../../types/api'

/** Ícone do selo de cada tipo (o `heart` usa a cor de perigo; os demais, a cor principal do tema). */
const ICONE_POR_TIPO: Record<NotificacaoTipo, string> = {
    LIKE: 'heart-outline',
    REPLY: 'chatbubble-outline',
    FOLLOW: 'person-add-outline',
    FOLLOW_REQUEST: 'person-add-outline',
    FOLLOW_ACCEPTED: 'checkmark-outline',
}

interface ToastNotificacaoProps {
    notificacao: Notificacao
    /** Tempo até o toast sumir (em ms): alimenta a barra de progresso. */
    duracaoMs: number
    onFechar: () => void
}

/**
 * Toast de uma notificação em tempo real: foto de quem agiu (até 2), selo com o ícone do tipo, frase agrupada, trecho
 * da resposta e uma barra de tempo. Clicar leva ao destino da notificação (perfil ou postagem). Sem botões de ação:
 * aceitar/recusar solicitações fica na sidebar e na tela de notificações.
 */
function ToastNotificacao({ notificacao, duracaoMs, onFechar }: ToastNotificacaoProps) {
    const atores = notificacao.atores.slice(0, 2)
    const varios = atores.length > 1

    return (
        <div className="toast-notificacao" role="status">
            <Link to={destinoDaNotificacao(notificacao)} onClick={onFechar} className="toast-notificacao-link">
                <div className={`toast-notificacao-fotos ${varios ? 'varios' : ''}`.trim()}>
                    {atores.map((ator, indice) => (
                        <Avatar key={ator.id} user={ator} alt="" className={`toast-notificacao-foto foto-${indice}`} />
                    ))}
                    <span className={`toast-notificacao-tipo tipo-${notificacao.tipo.toLowerCase()}`}>
                        <ion-icon name={ICONE_POR_TIPO[notificacao.tipo]}></ion-icon>
                    </span>
                </div>
                <div className="toast-notificacao-corpo">
                    <p className="toast-notificacao-legenda">
                        <strong>{nomesDosAtores(notificacao)}</strong> {acaoDaNotificacao(notificacao)}
                    </p>
                    {notificacao.tipo === 'REPLY' && notificacao.trecho && (
                        <p className="toast-notificacao-trecho">{notificacao.trecho}</p>
                    )}
                    <p className="toast-notificacao-tempo">agora</p>
                </div>
            </Link>
            <button type="button" className="toast-notificacao-fechar" aria-label="Fechar" onClick={onFechar}>
                <ion-icon name="close-outline"></ion-icon>
            </button>
            <div className="toast-notificacao-barra" style={{ animationDuration: `${duracaoMs}ms` }} aria-hidden="true" />
        </div>
    )
}

export default ToastNotificacao
