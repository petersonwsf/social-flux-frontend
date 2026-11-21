import { createContext } from 'react'
import type { AuthAccount, AuthResponse, LoginPayload, RegisterPayload, Usuario } from '../types/api'

export interface AuthContextValue {
    /** Perfil do usuário logado (profile_service), ou null quando não há sessão válida. */
    user: Usuario | null
    /** Identidade da conta (authentication_service): UUID e e-mail. */
    account: AuthAccount | null
    /** E-mail da conta já confirmado? */
    emailVerified: boolean
    /** true enquanto a sessão existente (cookie) ainda está sendo verificada ao abrir o app. */
    carregando: boolean
    login: (payload: LoginPayload) => Promise<void>
    register: (payload: RegisterPayload) => Promise<void>
    logout: () => Promise<void>
    /** Aplica uma resposta de autenticação do servidor (conta + temporização da sessão) e carrega o perfil. */
    applyAuth: (auth: AuthResponse) => Promise<void>
    /** Atualiza o perfil em memória (ex.: após editar o perfil ou trocar a foto). */
    updateUser: (user: Usuario) => void
    /** Busca de novo a conta e o perfil no servidor. */
    refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
