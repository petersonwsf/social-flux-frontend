import { NavLink } from 'react-router-dom'

interface SidebarMenuProps {
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
    solicitacoesPendentes,
    naoVistas,
    onAbrirSolicitacoes,
    onAbrirBusca,
    onAbrirNotificacoes,
}: SidebarMenuProps) {
    return (
        <ul className="nav nav-pills flex-column px-2">
            <li>
                <NavLink to="/" end className="nav-link d-flex align-items-center">
                    <ion-icon name="home-outline"></ion-icon>
                    Início
                </NavLink>
            </li>
            <li>
                <NavLink to="/criarPost" className="nav-link d-flex align-items-center">
                    <ion-icon name="create-outline"></ion-icon>
                    Criar postagem
                </NavLink>
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
        </ul>
    )
}

export default SidebarMenu
