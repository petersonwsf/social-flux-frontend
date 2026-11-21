import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { resetBootstrapModals } from './lib/bootstrapModal'
import ProtectedLayout from './components/layout/ProtectedLayout'
import CriarPostagem from './pages/CriarPostagem/CriarPostagem'
import EditarPerfil from './pages/EditarPerfil/EditarPerfil'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Home from './pages/Home/Home'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import Login from './pages/Login/Login'
import NotFound from './pages/NotFound/NotFound'
import Notifications from './pages/Notifications/Notifications'
import Perfil from './pages/Perfil/Perfil'
import PostPage from './pages/PostPage/PostPage'
import SearchUser from './pages/SearchUser/SearchUser'
import Settings from './pages/Settings/Settings'

function App() {
    const { pathname } = useLocation()

    // Ao trocar de rota com um modal aberto, remove o backdrop que ficaria órfão.
    useEffect(() => {
        resetBootstrapModals()
    }, [pathname])

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/perfil/:username" element={<Perfil />} />
                <Route path="/editar" element={<EditarPerfil />} />
                <Route path="/criarPost" element={<CriarPostagem />} />
                <Route path="/postagem/:id" element={<PostPage />} />
                <Route path="/search" element={<SearchUser />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
