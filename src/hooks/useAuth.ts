import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '../contexts/authContext'
import type { Usuario } from '../types/api'

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
    return context
}

/** Para telas protegidas: garante um usuário logado (o layout já redireciona se não houver). */
export function useCurrentUser(): Usuario {
    const { user } = useAuth()
    if (!user) throw new Error('useCurrentUser usado sem usuário autenticado')
    return user
}
