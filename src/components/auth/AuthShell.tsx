import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/img/logo.png'

/** Moldura simples (cartão centralizado) das telas de conta fora do login: recuperar/redefinir senha e verificar e-mail. */
function AuthShell({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="login-page">
            <div className="login-panel d-flex flex-column align-items-center justify-content-center p-4">
                <Link to="/login" className="d-flex align-items-center text-decoration-none mb-4 brand">
                    <img src={logo} alt="" className="logo" />
                    Social Flux
                </Link>
                <div className="auth-form">
                    <h1 className="display-6 text-center mb-4">{title}</h1>
                    {children}
                </div>
            </div>
        </section>
    )
}

export default AuthShell
