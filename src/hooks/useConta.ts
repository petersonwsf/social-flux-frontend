import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../services/authService'
import * as usuarioService from '../services/usuarioService'
import { getErrorMessage } from '../lib/errors'
import { useAuth, useCurrentUser } from './useAuth'
import { useToast } from './useToast'
import type { ChangePasswordPayload, EditarPerfilPayload } from '../types/api'

/** Ações sobre a conta do usuário logado: perfil, foto, senha, sessões e exclusão. */
export function useConta() {
    const user = useCurrentUser()
    const { updateUser, applyAuth, logout } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const editarPerfil = useCallback(
        async (values: EditarPerfilPayload) => {
            try {
                updateUser(await usuarioService.editarPerfil(user.id, values))
                navigate(`/perfil/${values.username}`, { replace: true })
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [user.id, updateUser, navigate, toast],
    )

    const atualizarFotoPerfil = useCallback(
        async (foto: File) => {
            try {
                updateUser(await usuarioService.atualizarFotoPerfil(user.id, foto))
                navigate(`/perfil/${user.username}`, { replace: true })
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [user.id, user.username, updateUser, navigate, toast],
    )

    const alterarSenha = useCallback(
        async (values: ChangePasswordPayload): Promise<boolean> => {
            try {
                await applyAuth(await authService.changePassword(values))
                toast.success('Senha alterada! As outras sessões foram encerradas.')
                return true
            } catch (error) {
                toast.error(getErrorMessage(error))
                return false
            }
        },
        [applyAuth, toast],
    )

    const sairDeTodosOsDispositivos = useCallback(async () => {
        try {
            await authService.logoutAll()
            await logout()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }, [logout, toast])

    const reenviarVerificacao = useCallback(async () => {
        try {
            toast.notify(await authService.resendVerification())
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }, [toast])

    const excluirConta = useCallback(
        async (senha: string) => {
            try {
                toast.notify(await authService.deleteAccount(senha))
                await logout()
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [logout, toast],
    )

    return {
        editarPerfil,
        atualizarFotoPerfil,
        alterarSenha,
        sairDeTodosOsDispositivos,
        reenviarVerificacao,
        excluirConta,
    }
}
