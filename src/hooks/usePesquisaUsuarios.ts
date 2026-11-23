import { useEffect, useState } from 'react'
import * as usuarioService from '../services/usuarioService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { Usuario } from '../types/api'

const DEBOUNCE_MS = 300

/**
 * Pesquisa de usuários com debounce, para não disparar uma requisição a cada tecla.
 * `carregando` fica ativo da digitação até a resposta (intervalo do debounce + requisição).
 */
export function usePesquisaUsuarios(debounceMs: number = DEBOUNCE_MS) {
    const toast = useToast()
    const [busca, setBusca] = useState('')
    const [resultados, setResultados] = useState<Usuario[]>([])
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        const termo = busca.trim()
        if (!termo) {
            setResultados([])
            setCarregando(false)
            return
        }

        let ignore = false
        setCarregando(true)
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
                .finally(() => {
                    if (!ignore) setCarregando(false)
                })
        }, debounceMs)

        return () => {
            ignore = true
            window.clearTimeout(timer)
        }
    }, [busca, debounceMs, toast])

    return { busca, setBusca, resultados, carregando }
}
