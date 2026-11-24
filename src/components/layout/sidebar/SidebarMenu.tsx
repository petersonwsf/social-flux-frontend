import { NavLink } from 'react-router-dom'
import Avatar from '../../common/Avatar'
import { MODAL_POSTAR } from '../../modals/ModalPostar'
import type { Usuario } from '../../../types/api'

interface SidebarMenuProps {
    user: Usuario
    solicitacoesPendentes: number
    naoVistas: number
    onAbrirSolicitacoes: () => void
    onAbrirBusca: () => void
    onAbrirNotificacoes: () => void
}

function Badge({ value }: { value: number }) {
    if (value <= 0) return null
    return <span className="badge rounded-pill bg-primary ms-auto">{value > 99 ? '99+' : value}</span>
}

/** Texto do tooltip do item de solicitações (singular/plural e nenhuma pendente). */
function tituloSolicitacoes(total: number): string {
    if (total <= 0) return 'Nenhuma solicitação pendente'
    return total === 1 ? '1 solicitação pendente' : `${total} solicitações pendentes`
}

function SidebarMenu({
    user,
    solicitacoesPendentes,
    naoVistas,
    onAbrirSolicitacoes,
    onAbrirBusca,
    onAbrirNotificacoes,
}: SidebarMenuProps) {
    return (
        <ul className="nav nav-pills flex-column gap-2 px-2">
            <li>
                <NavLink to="/" end className="nav-link d-flex align-items-center">
                    <ion-icon name="home-outline"></ion-icon>
                    Página inicial
                </NavLink>
            </li>
            <li>
                <button type="button" onClick={onAbrirBusca} className="nav-link d-flex align-items-center w-100">
                    <ion-icon name="search-outline"></ion-icon>
                    Buscar usuário
                </button>
            </li>
            <li>
                <button type="button" onClick={onAbrirNotificacoes} className="nav-link d-flex align-items-center w-100">
                    <ion-icon name="notifications-outline"></ion-icon>
                    Notificações
                    <Badge value={naoVistas} />
                </button>
            </li>
            <li>
                <button
                    type="button"
                    onClick={onAbrirSolicitacoes}
                    className="nav-link d-flex align-items-center w-100"
                    title={tituloSolicitacoes(solicitacoesPendentes)}
                >
                    <ion-icon name="person-add-outline"></ion-icon>
                    Solicitações
                    <Badge value={solicitacoesPendentes} />
                </button>
            </li>
            <li>
                <NavLink to={`/perfil/${user.username}`} className="nav-link d-flex align-items-center">
                    <Avatar user={user} size="1.25rem" className="me-2 flex-shrink-0" alt="" />
                    Meu perfil
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings" className="nav-link d-flex align-items-center">
                    <ion-icon name="settings-outline"></ion-icon>
                    Configurações
                </NavLink>
            </li>
            <li className="mt-2">
                <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center justify-content-center w-100"
                    data-bs-toggle="modal"
                    data-bs-target={`#${MODAL_POSTAR}`}
                >
                    <ion-icon name="create-outline"></ion-icon>
                    Postar
                </button>
            </li>
        </ul>
    )
}

export default SidebarMenu
