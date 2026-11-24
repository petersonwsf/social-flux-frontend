import { NavLink, useLocation } from 'react-router-dom'
import { useNotificacoes } from '../../hooks/useNotificacoes'
import { useRelacoesPendentes } from '../../hooks/useRelacoesPendentes'
import Avatar from '../common/Avatar'
import { MODAL_POSTAR } from '../modals/ModalPostar'
import type { Usuario } from '../../types/api'

/**
 * Navegação do mobile: barra inferior (início, busca, notificações — que já inclui as solicitações —, perfil e
 * configurações) e o botão redondo "Postar", fixo no canto inferior direito, acima da barra.
 */
function FooterBar({ user }: { user: Usuario }) {
    const { naoVistas, zerarContador } = useNotificacoes()
    const { total: solicitacoesPendentes } = useRelacoesPendentes(user)
    const pendencias = naoVistas + solicitacoesPendentes
    // Na própria página de criar postagem o botão flutuante seria redundante (e cobriria o formulário).
    const mostrarBotaoPostar = useLocation().pathname !== '/criarPost'

    return (
        <>
            {mostrarBotaoPostar && (
                <button
                    type="button"
                    className="btn btn-primary fab-postar d-lg-none"
                    aria-label="Postar"
                    title="Postar"
                    data-bs-toggle="modal"
                    data-bs-target={`#${MODAL_POSTAR}`}
                >
                    <ion-icon name="create-outline"></ion-icon>
                </button>
            )}
            <footer className="fixed-bottom d-lg-none">
                <nav className="d-flex justify-content-between nav nav-pills p-2 footer-bar" aria-label="Navegação principal">
                    <NavLink to="/" end className="nav-link d-flex align-items-center" aria-label="Página inicial" title="Página inicial">
                        <ion-icon name="home-outline"></ion-icon>
                    </NavLink>
                    <NavLink to="/search" className="nav-link d-flex align-items-center" aria-label="Buscar usuário" title="Buscar usuário">
                        <ion-icon name="search-outline"></ion-icon>
                    </NavLink>
                    <NavLink
                        to="/notifications"
                        onClick={zerarContador}
                        className="nav-link d-flex align-items-center position-relative"
                        aria-label="Notificações e solicitações"
                        title="Notificações e solicitações"
                    >
                        <ion-icon name="notifications-outline"></ion-icon>
                        {pendencias > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                {pendencias > 99 ? '99+' : pendencias}
                            </span>
                        )}
                    </NavLink>
                    <NavLink
                        to={`/perfil/${user.username}`}
                        className="nav-link d-flex align-items-center"
                        aria-label="Meu perfil"
                        title="Meu perfil"
                    >
                        <Avatar user={user} size="1.6rem" alt="" />
                    </NavLink>
                    <NavLink to="/settings" className="nav-link d-flex align-items-center" aria-label="Configurações" title="Configurações">
                        <ion-icon name="settings-outline"></ion-icon>
                    </NavLink>
                </nav>
            </footer>
        </>
    )
}

export default FooterBar
