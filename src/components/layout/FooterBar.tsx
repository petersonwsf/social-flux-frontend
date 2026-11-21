import { NavLink } from 'react-router-dom'
import { useNotificacoes } from '../../hooks/useNotificacoes'
import type { Usuario } from '../../types/api'

function FooterBar({ user }: { user: Usuario }) {
    const { naoVistas, zerarContador } = useNotificacoes()

    return (
        <footer className="fixed-bottom d-lg-none">
            <nav className="d-flex justify-content-between nav nav-pills p-2 footer-bar" aria-label="Navegação principal">
                <NavLink to="/" end className="nav-link d-flex align-items-center" aria-label="Início">
                    <ion-icon name="home-outline"></ion-icon>
                </NavLink>
                <NavLink to="/search" className="nav-link d-flex align-items-center" aria-label="Buscar">
                    <ion-icon name="search-outline"></ion-icon>
                </NavLink>
                <NavLink to="/criarPost" className="nav-link d-flex align-items-center" aria-label="Criar postagem">
                    <ion-icon name="create-outline"></ion-icon>
                </NavLink>
                <NavLink
                    to="/notifications"
                    onClick={zerarContador}
                    className="nav-link d-flex align-items-center position-relative"
                    aria-label="Notificações"
                >
                    <ion-icon name="notifications-outline"></ion-icon>
                    {naoVistas > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                            {naoVistas}
                        </span>
                    )}
                </NavLink>
                <NavLink to={`/perfil/${user.username}`} className="nav-link d-flex align-items-center" aria-label="Perfil">
                    <ion-icon name="person-circle-outline"></ion-icon>
                </NavLink>
            </nav>
        </footer>
    )
}

export default FooterBar
