import { Navigate, Outlet } from 'react-router-dom'
import { NotificationsProvider } from '../../contexts/NotificationsProvider'
import { useAuth } from '../../hooks/useAuth'
import Brand from './Brand'
import FooterBar from './FooterBar'
import Sidebar from './sidebar/Sidebar'

/** Casca das telas autenticadas: sidebar (desktop), cabeçalho/rodapé (mobile) e a rota filha. */
function ProtectedLayout() {
    const { user, carregando } = useAuth()

    if (carregando) return null
    if (!user) return <Navigate to="/login" replace />

    return (
        <NotificationsProvider>
            <div className="d-block d-lg-flex">
                <header className="d-block d-lg-none w-100 py-2 border-bottom text-center small-header sticky-top">
                    <Brand className="justify-content-center fs-3" />
                </header>
                <Sidebar user={user} />
                <div className="container-main mb-5">
                    <main className="main mt-3 mt-lg-4">
                        <Outlet />
                    </main>
                </div>
                <FooterBar user={user} />
            </div>
        </NotificationsProvider>
    )
}

export default ProtectedLayout
