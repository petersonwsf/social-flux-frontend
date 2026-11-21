import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './authContext'
import { setUnauthorizedHandler } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { setSessionTiming } from '../lib/session'
import * as authService from '../services/authService'
import * as usuarioService from '../services/usuarioService'
import { useToast } from '../hooks/useToast'
import type { AuthAccount, AuthResponse, Usuario } from '../types/api'

/** Token da versão anterior (localStorage): removido para não deixar credencial exposta ao JavaScript. */
const LEGACY_TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
    const toast = useToast()
    const [user, setUser] = useState<Usuario | null>(null)
    const [account, setAccount] = useState<AuthAccount | null>(null)
    const [carregando, setCarregando] = useState(true)
    const userRef = useRef<Usuario | null>(null)

    const updateUser = useCallback((novo: Usuario | null) => {
        userRef.current = novo
        setUser(novo)
    }, [])

    const clearSession = useCallback(() => {
        setSessionTiming(null)
        setAccount(null)
        updateUser(null)
    }, [updateUser])

    // A conta (authentication_service) e o perfil (profile_service) são serviços diferentes:
    // a resposta de autenticação traz só a identidade, e o perfil é buscado em seguida.
    const applyAuth = useCallback(
        async (auth: AuthResponse, forceProfile = false) => {
            setSessionTiming(auth)
            setAccount(auth.account)
            if (forceProfile || !userRef.current || userRef.current.id !== auth.account.accountId) {
                updateUser(await usuarioService.meuPerfil())
            }
        },
        [updateUser],
    )

    // Restaura a sessão a partir dos cookies HttpOnly (o frontend não consegue lê-los).
    // Se o token de acesso expirou mas o refresh ainda vale, o interceptor do axios renova e repete a chamada.
    useEffect(() => {
        let ignore = false
        localStorage.removeItem(LEGACY_TOKEN_KEY)

        authService
            .me()
            .then((auth) => (ignore ? undefined : applyAuth(auth)))
            .catch(() => {
                // 401: não há sessão; o usuário será levado ao login.
            })
            .finally(() => {
                if (!ignore) setCarregando(false)
            })

        return () => {
            ignore = true
        }
    }, [applyAuth])

    const refreshUser = useCallback(async () => {
        try {
            await applyAuth(await authService.me(), true)
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }, [applyAuth, toast])

    const logout = useCallback(async () => {
        try {
            await authService.logout()
        } catch {
            // Mesmo sem resposta do servidor, a sessão local é encerrada.
        }
        clearSession()
    }, [clearSession])

    const login = useCallback<AuthContextValue['login']>(
        async (payload) => {
            try {
                await applyAuth(await authService.login(payload))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [applyAuth, toast],
    )

    const register = useCallback<AuthContextValue['register']>(
        async (payload) => {
            try {
                await applyAuth(await authService.register(payload))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [applyAuth, toast],
    )

    // Sessão que não pode mais ser renovada (expirou, foi revogada ou excedeu o limite): volta ao login.
    useEffect(() => {
        setUnauthorizedHandler(() => {
            if (!userRef.current) return
            clearSession()
            toast.error('Sua sessão expirou, entre novamente.')
        })
        return () => setUnauthorizedHandler(null)
    }, [clearSession, toast])

    const emailVerified = account?.emailVerified ?? false

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            account,
            emailVerified,
            carregando,
            login,
            register,
            logout,
            applyAuth: (auth) => applyAuth(auth),
            updateUser,
            refreshUser,
        }),
        [user, account, emailVerified, carregando, login, register, logout, applyAuth, updateUser, refreshUser],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
