import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import FormSignin from '../../components/forms/FormSignin'
import FormSignup from '../../components/forms/FormSignup'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/img/logo.png'

function Login() {
    const { user, carregando, login, register } = useAuth()
    const [showLogin, setShowLogin] = useState(true)

    if (carregando) return null
    if (user) return <Navigate to="/" replace />

    const toggleForm = () => setShowLogin((atual) => !atual)

    return (
        <section className="login-page">
            <div className="row g-0">
                <div className="col-12 col-lg-6 login-panel p-4 p-lg-5 d-flex align-items-center justify-content-center">
                    {showLogin ? (
                        <FormSignin onSubmit={login} toggleForm={toggleForm} />
                    ) : (
                        <FormSignup onSubmit={register} toggleForm={toggleForm} />
                    )}
                </div>
                <div className="col-lg-6 login-hero d-none d-lg-flex align-items-center justify-content-center flex-column">
                    <img src={logo} alt="" style={{ width: '150px' }} />
                    <h1 className="display-1 text-white">Social Flux</h1>
                </div>
            </div>
        </section>
    )
}

export default Login
