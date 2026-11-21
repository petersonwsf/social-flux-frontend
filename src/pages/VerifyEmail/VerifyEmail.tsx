import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../lib/errors'
import * as authService from '../../services/authService'

type Estado = { tipo: 'carregando' } | { tipo: 'ok' } | { tipo: 'erro'; mensagem: string }

function VerifyEmail() {
    const [params] = useSearchParams()
    const token = params.get('token') ?? ''
    const { user, refreshUser } = useAuth()
    const iniciou = useRef(false)
    const [estado, setEstado] = useState<Estado>(
        token ? { tipo: 'carregando' } : { tipo: 'erro', mensagem: 'Link incompleto.' },
    )

    // O token é de uso único: o guard evita a segunda chamada do StrictMode em desenvolvimento.
    useEffect(() => {
        if (!token || iniciou.current) return
        iniciou.current = true

        authService
            .verifyEmail(token)
            .then(() => {
                setEstado({ tipo: 'ok' })
                if (user) void refreshUser()
            })
            .catch((error: unknown) => setEstado({ tipo: 'erro', mensagem: getErrorMessage(error) }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <AuthShell title="Confirmação de e-mail">
            {estado.tipo === 'carregando' && <p className="text-center">Confirmando…</p>}
            {estado.tipo === 'ok' && <p className="text-center">E-mail confirmado com sucesso!</p>}
            {estado.tipo === 'erro' && <p className="text-center text-danger">{estado.mensagem}</p>}
            <div className="text-center mt-4">
                <Link to={user ? '/' : '/login'} className="btn btn-primary">
                    Continuar
                </Link>
            </div>
        </AuthShell>
    )
}

export default VerifyEmail
