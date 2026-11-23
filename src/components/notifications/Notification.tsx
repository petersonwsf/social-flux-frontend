import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import { acaoDaNotificacao, destinoDaNotificacao, nomesDosAtores } from '../../lib/notificacoesTexto'
import { calcTempPost } from '../../lib/dates'
import type { Notificacao, NotificacaoTipo } from '../../types/api'

const ICONE_POR_TIPO: Record<NotificacaoTipo, { name: string; className: string }> = {
    LIKE: { name: 'heart-outline', className: 'text-danger' },
    REPLY: { name: 'chatbubble-outline', className: 'text-primary' },
    FOLLOW: { name: 'person-add-outline', className: 'text-primary' },
    FOLLOW_REQUEST: { name: 'person-add-outline', className: 'text-primary' },
    FOLLOW_ACCEPTED: { name: 'checkmark-outline', className: 'text-success' },
}

interface NotificationProps {
    notificacao: Notificacao
    /** Só para `FOLLOW_REQUEST`: aceitar ou recusar a solicitação direto na notificação. */
    onAceitar?: (notificacao: Notificacao) => void
    onRecusar?: (notificacao: Notificacao) => void
}

/** Uma notificação (grupo): ícone, até 2 avatares, "Ana, Bia e mais 3 curtiram…", trecho da resposta e, nas solicitações, os botões de ícone (aceitar/recusar). */
function Notification({ notificacao, onAceitar, onRecusar }: NotificationProps) {
    const icone = ICONE_POR_TIPO[notificacao.tipo]
    const ehSolicitacao = notificacao.tipo === 'FOLLOW_REQUEST'

    return (
        <div
            className={`notification d-flex align-items-center border-bottom py-2 pe-3 ${
                notificacao.vista ? 'viewed' : 'no-viewed'
            }`}
        >
            <Link className="d-block text-decoration-none flex-grow-1 min-w-0 ps-3" to={destinoDaNotificacao(notificacao)}>
                <div className="d-flex align-items-center mb-1">
                    <span className={`d-flex flex-shrink-0 me-3 ${icone.className}`}>
                        <ion-icon name={icone.name}></ion-icon>
                    </span>
                    {notificacao.atores.slice(0, 2).map((ator, indice) => (
                        <Avatar
                            key={ator.id}
                            user={ator}
                            size="26px"
                            alt=""
                            style={indice > 0 ? { marginLeft: '-10px' } : undefined}
                        />
                    ))}
                </div>
                <div className="min-w-0 notification-text notification-legenda">
                    <p className="mb-0">
                        <span className="fw-medium">{nomesDosAtores(notificacao)}</span> {acaoDaNotificacao(notificacao)}{' '}
                        <small className="text-muted notification-time">{calcTempPost(notificacao.atualizada_em)}</small>
                    </p>
                    {notificacao.tipo === 'REPLY' && notificacao.trecho && (
                        <p className="mb-0 text-muted text-truncate">{notificacao.trecho}</p>
                    )}
                </div>
            </Link>
            {ehSolicitacao && (
                <div className="d-flex gap-1 ms-2 flex-shrink-0">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm d-flex align-items-center p-1"
                        aria-label="Aceitar solicitação"
                        title="Aceitar"
                        onClick={() => onAceitar?.(notificacao)}
                    >
                        <ion-icon name="checkmark-outline"></ion-icon>
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center p-1"
                        aria-label="Recusar solicitação"
                        title="Recusar"
                        onClick={() => onRecusar?.(notificacao)}
                    >
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Notification
