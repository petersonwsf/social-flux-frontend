import { useEffect } from 'react'
import { useNotificacoes } from '../../../hooks/useNotificacoes'
import ListNotifications from '../../notifications/ListNotifications'
import SidebarBackLink from './SidebarBackLink'

function NotificationsSidebar({ onVoltar }: { onVoltar: () => void }) {
    const { notificacoes, temMais, carregando, carregarMais, marcarComoVistas, abrirArea, aceitarSolicitacao, recusarSolicitacao } =
        useNotificacoes()

    // Com o painel aberto o badge fica zerado e não aparece toast (D14).
    useEffect(() => abrirArea(), [abrirArea])

    return (
        <div>
            <SidebarBackLink
                onClick={() => {
                    marcarComoVistas()
                    onVoltar()
                }}
            />
            <ListNotifications
                notifications={notificacoes}
                onAceitar={(notificacao) => void aceitarSolicitacao(notificacao)}
                onRecusar={(notificacao) => void recusarSolicitacao(notificacao)}
                temMais={temMais}
                carregando={carregando}
                onCarregarMais={carregarMais}
            />
        </div>
    )
}

export default NotificationsSidebar
