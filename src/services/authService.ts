import { api } from '../lib/api'
import type {
    AuthResponse,
    ChangePasswordPayload,
    LoginPayload,
    Mensagem,
    RegisterPayload,
} from '../types/api'

/**
 * Cliente do authentication_service. O JWT e o refresh token viajam em cookies HttpOnly (Set-Cookie);
 * as respostas trazem o usuário e `expiresAt`/`renewAt` para a renovação automática.
 * Rotas "de entrada" usam `skipSessionRefresh`: um 401 nelas é resposta normal, não sessão expirada.
 */
const ENTRY = { skipSessionRefresh: true } as const

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload, ENTRY)
    return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload, ENTRY)
    return data
}

/** Usuário da sessão atual; se o token expirou mas o refresh vale, o interceptor renova e repete. */
export async function me(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>('/auth/me')
    return data
}

export async function logout(): Promise<void> {
    await api.post('/auth/logout', null, ENTRY)
}

/** "Sair de todos os dispositivos". */
export async function logoutAll(): Promise<void> {
    await api.post('/auth/logout-all')
}

export async function forgotPassword(email: string): Promise<Mensagem> {
    const { data } = await api.post<Mensagem>('/auth/forgot-password', { email }, ENTRY)
    return data
}

export async function resetPassword(token: string, novaSenha: string): Promise<Mensagem> {
    const { data } = await api.post<Mensagem>('/auth/reset-password', { token, novaSenha }, ENTRY)
    return data
}

export async function verifyEmail(token: string): Promise<Mensagem> {
    const { data } = await api.post<Mensagem>('/auth/verify-email', { token }, ENTRY)
    return data
}

export async function resendVerification(): Promise<Mensagem> {
    const { data } = await api.post<Mensagem>('/auth/resend-verification')
    return data
}

/** Troca a senha, encerra as outras sessões e mantém esta (devolve a sessão renovada). */
export async function changePassword(payload: ChangePasswordPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/change-password', payload)
    return data
}

/** Exclui a conta (exige a senha). */
export async function deleteAccount(senha: string): Promise<Mensagem> {
    const { data } = await api.delete<Mensagem>('/auth/account', { data: { senha } })
    return data
}
