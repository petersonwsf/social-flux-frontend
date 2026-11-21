import Notification from './Notification'
import type { Notificacao } from '../../types/api'

interface ListNotificationsProps {
    notifications: Notificacao[]
    onAceitar?: (notificacao: Notificacao) => void
    onRecusar?: (notificacao: Notificacao) => void
    /** Há mais páginas: mostra o botão "Carregar mais". */
    temMais?: boolean
    carregando?: boolean
    onCarregarMais?: () => void
}

function ListNotifications({
    notifications,
    onAceitar,
    onRecusar,
    temMais = false,
    carregando = false,
    onCarregarMais,
}: ListNotificationsProps) {
    return (
        <div className="notifications">
            {notifications.map((notificacao) => (
                <Notification key={notificacao.id} notificacao={notificacao} onAceitar={onAceitar} onRecusar={onRecusar} />
            ))}
            {notifications.length === 0 && !temMais && <p className="text-center text-muted py-3 mb-0">Nenhuma notificação</p>}
            {temMais && (
                <div className="text-center my-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" disabled={carregando} onClick={onCarregarMais}>
                        Carregar mais
                    </button>
                </div>
            )}
        </div>
    )
}

export default ListNotifications
