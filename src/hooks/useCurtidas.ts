import { useCallback, useState } from 'react'
import * as postagemService from '../services/postagemService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { Postagem } from '../types/api'

/**
 * Curtida de uma postagem para o usuário logado. O estado inicial (`curtido`, `curtidas`) já vem na própria postagem;
 * curtir/descurtir são idempotentes no servidor e devolvem o estado real, que substitui o local.
 */
export function useCurtidas(postagem: Postagem) {
    const toast = useToast()
    const [curtido, setCurtido] = useState(postagem.curtido)
    const [total, setTotal] = useState(postagem.curtidas)
    const [enviando, setEnviando] = useState(false)

    const alternar = useCallback(async () => {
        if (enviando) return
        setEnviando(true)
        try {
            const estado = curtido ? await postagemService.descurtir(postagem.id) : await postagemService.curtir(postagem.id)
            setCurtido(estado.curtido)
            setTotal(estado.curtidas)
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setEnviando(false)
        }
    }, [curtido, enviando, postagem, toast])

    return { curtido, total, alternar }
}
