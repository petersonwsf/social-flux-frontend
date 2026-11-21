import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificacoes } from '../../../hooks/useNotificacoes'
import { useRelacoesPendentes } from '../../../hooks/useRelacoesPendentes'
import Avatar from '../../common/Avatar'
import ModalAction from '../../modals/ModalAction'
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
                <div className="dropdown dropup p-3">
                    <button
                        type="button"
                        className="btn d-flex align-items-center w-100 text-start dropdown-toggle user-menu"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <Avatar user={user} size="30px" className="me-2" alt="" />
                        <span className="text-truncate">{user.username}</span>
                    </button>
                    <ul className="dropdown-menu text-small">
                        <li>
                            <Link className="dropdown-item d-flex align-items-center" to={`/perfil/${user.username}`}>
                                <ion-icon name="person-circle-outline"></ion-icon>Perfil
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="dropdown-item d-flex align-items-center">
                                <ion-icon name="settings-outline"></ion-icon>Configurações
                            </Link>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <button
                                type="button"
                                className="dropdown-item d-flex align-items-center"
                                data-bs-toggle="modal"
                                data-bs-target="#modalLogout"
                            >
                                <ion-icon name="log-out-outline"></ion-icon>Sair
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
            <ModalAction id="modalLogout" title="Deseja sair?" action={() => void logout()} titleAction="Sair" danger />
        </section>
    )
}

export default Sidebar
