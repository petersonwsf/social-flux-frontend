import { useEffect, useState } from 'react'
import * as usuarioService from '../services/usuarioService'
import { getErrorMessage, getErrorStatus } from '../lib/errors'
import { useToast } from './useToast'
import type { Usuario } from '../types/api'

/** Carrega o perfil de um usuário pelo username (`naoEncontrado` quando a API responde 404). */
export function usePerfil(username: string) {
    const toast = useToast()
    const [perfil, setPerfil] = useState<Usuario | null>(null)
    const [naoEncontrado, setNaoEncontrado] = useState(false)

    useEffect(() => {
        let ignore = false
        setPerfil(null)
        setNaoEncontrado(false)

        usuarioService
            .buscarPorUsername(username)
            .then((usuario) => {
                if (!ignore) setPerfil(usuario)
            })
            .catch((error: unknown) => {
                if (ignore) return
                if (getErrorStatus(error) === 404) setNaoEncontrado(true)
                else toast.error(getErrorMessage(error))
            })

        return () => {
            ignore = true
        }
    }, [username, toast])

    return { perfil, naoEncontrado }
}
