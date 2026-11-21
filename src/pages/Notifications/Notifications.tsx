import { useEffect, useState } from 'react'
import ButtonBack from '../../components/common/ButtonBack'
import TabMenu from '../../components/common/TabMenu'
import ListNotifications from '../../components/notifications/ListNotifications'
import ListaRelacoesNaoAceitas from '../../components/relacoes/ListaRelacoesNaoAceitas'
import { useCurrentUser } from '../../hooks/useAuth'
import { useNotificacoes } from '../../hooks/useNotificacoes'
import { useRelacoesPendentes } from '../../hooks/useRelacoesPendentes'

type Aba = 'notificacoes' | 'solicitacoes'

const TABS: ReadonlyArray<{ id: Aba; label: string }> = [
    { id: 'notificacoes', label: 'Notificações' },
    { id: 'solicitacoes', label: 'Solicitações' },
]

function Notifications() {
    const user = useCurrentUser()
    const {
        notificacoes,
        temMais: temMaisNotificacoes,
        carregando,
        carregarMais: carregarMaisNotificacoes,
        zerarContador,
        marcarComoVistas,
        abrirArea,
        aceitarSolicitacao,
        recusarSolicitacao,
    } = useNotificacoes()
    const { pendentes, temMais, carregarMais, aceitar, recusar } = useRelacoesPendentes(user)
    const [aba, setAba] = useState<Aba>('notificacoes')

    // Ao abrir a tela o badge zera (e o toast fica desligado, D14); ao sair, as notificações exibidas são marcadas como vistas.
    useEffect(() => {
        zerarContador()
        const fecharArea = abrirArea()
        return () => {
            fecharArea()
            marcarComoVistas()
        }
    }, [zerarContador, abrirArea, marcarComoVistas])

    return (
        <div className="notifications-page">
            <div className="mb-2">
                <ButtonBack />
            </div>
            <TabMenu tabs={TABS} active={aba} onChange={setAba} />
            {aba === 'notificacoes' ? (
                <ListNotifications
                    notifications={notificacoes}
                    onAceitar={(notificacao) => void aceitarSolicitacao(notificacao)}
                    onRecusar={(notificacao) => void recusarSolicitacao(notificacao)}
                    temMais={temMaisNotificacoes}
                    carregando={carregando}
                    onCarregarMais={carregarMaisNotificacoes}
                />
            ) : (
                <ListaRelacoesNaoAceitas
                    solicitacoes={pendentes}
                    temMais={temMais}
                    onCarregarMais={carregarMais}
                    onAceitar={aceitar}
                    onRecusar={recusar}
                />
            )}
        </div>
    )
}

export default Notifications
