import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificacoes } from '../../../hooks/useNotificacoes'
import { useRelacoesPendentes } from '../../../hooks/useRelacoesPendentes'
import ModalAction from '../../modals/ModalAction'
import ModalPostar from '../../modals/ModalPostar'
import Brand from '../Brand'
import NotificationsSidebar from './NotificationsSidebar'
import SearchUsuario from './SearchUsuario'
import SidebarMenu from './SidebarMenu'
import SidebarRelacoes from './SidebarRelacoes'
import type { Usuario } from '../../../types/api'

export type SidebarView = 'menu' | 'busca' | 'solicitacoes' | 'notificacoes'

function Sidebar({ user }: { user: Usuario }) {
    const { logout } = useAuth()
    const { naoVistas, zerarContador } = useNotificacoes()
    const { pendentes, total, temMais, carregarMais, aceitar, recusar } = useRelacoesPendentes(user)
    const [view, setView] = useState<SidebarView>('menu')

    const voltarAoMenu = () => setView('menu')

    return (
        <section>
            <aside className="sidebar d-none d-lg-flex flex-column flex-shrink-0 sticky-top">
                <div className="px-3 py-3">
                    <Brand className="fs-4" />
                </div>
                <hr className="m-0" />
                <div className="content py-3">
                    {view === 'menu' && (
                        <SidebarMenu
                            user={user}
                            solicitacoesPendentes={total}
                            naoVistas={naoVistas}
                            onAbrirSolicitacoes={() => setView('solicitacoes')}
                            onAbrirBusca={() => setView('busca')}
                            onAbrirNotificacoes={() => {
                                zerarContador()
                                setView('notificacoes')
                            }}
                        />
                    )}
                    {view === 'busca' && <SearchUsuario onVoltar={voltarAoMenu} />}
                    {view === 'solicitacoes' && (
                        <SidebarRelacoes
                            solicitacoes={pendentes}
                            temMais={temMais}
                            onVoltar={voltarAoMenu}
                            onCarregarMais={carregarMais}
                            onAceitar={aceitar}
                            onRecusar={recusar}
                        />
                    )}
                    {view === 'notificacoes' && <NotificationsSidebar onVoltar={voltarAoMenu} />}
                </div>
                <hr className="m-0" />
                <div className="p-3">
                    <button
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#modalLogout"
                    >
                        <ion-icon name="log-out-outline"></ion-icon>Sair
                    </button>
                </div>
            </aside>
            <ModalAction id="modalLogout" title="Deseja sair?" action={() => void logout()} titleAction="Sair" danger />
            <ModalPostar user={user} />
        </section>
    )
}

export default Sidebar
