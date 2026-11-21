import { useEffect, useState } from 'react'
import * as usuarioService from '../services/usuarioService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { Usuario } from '../types/api'

const DEBOUNCE_MS = 300

/** Pesquisa de usuários com debounce, para não disparar uma requisição a cada tecla. */
export function usePesquisaUsuarios() {
    const toast = useToast()
    const [busca, setBusca] = useState('')
    const [resultados, setResultados] = useState<Usuario[]>([])

    useEffect(() => {
        const termo = busca.trim()
        if (!termo) {
            setResultados([])
            return
        }

        let ignore = false
        const timer = window.setTimeout(() => {
            usuarioService
                .pesquisar(termo)
                .then((lista) => {
                    if (!ignore) setResultados(lista)
                })
                .catch((error: unknown) => {
                    if (ignore) return
                    setResultados([])
                    toast.error(getErrorMessage(error))
                })
        }, DEBOUNCE_MS)

        return () => {
            ignore = true
            window.clearTimeout(timer)
        }
    }, [busca, toast])

    return { busca, setBusca, resultados }
}
