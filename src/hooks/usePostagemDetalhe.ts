import { useCallback, useEffect, useState } from 'react'
import * as postagemService from '../services/postagemService'
import { getErrorMessage, getErrorStatus } from '../lib/errors'
import { useToast } from './useToast'
import type { Postagem } from '../types/api'

/**
 * Postagem da página de detalhe e a sua cadeia de pais (`GET /{id}/ancestrais`, da mais antiga à mais próxima, só as
 * visíveis). 404 (inexistente ou sem permissão) vira `naoEncontrada`, sem toast.
 */
export function usePostagemDetalhe(id: string) {
    const toast = useToast()
    const [postagem, setPostagem] = useState<Postagem | null>(null)
    const [ancestrais, setAncestrais] = useState<Postagem[]>([])
    const [naoEncontrada, setNaoEncontrada] = useState(false)
    const [versaoRespostas, setVersaoRespostas] = useState(0)

    useEffect(() => {
        let ignore = false
        setPostagem(null)
        setAncestrais([])
        setNaoEncontrada(false)

        postagemService
            .buscar(id)
            .then(async (resultado) => {
                if (ignore) return
                setPostagem(resultado)
                if (!resultado.pai) return
                const cadeia = await postagemService.buscarAncestrais(id)
                if (!ignore) setAncestrais(cadeia)
            })
            .catch((error: unknown) => {
                if (ignore) return
                if (getErrorStatus(error) === 404) {
                    setNaoEncontrada(true)
                } else {
                    toast.error(getErrorMessage(error))
                }
            })

        return () => {
            ignore = true
        }
    }, [id, toast])

    const recarregarRespostas = useCallback(() => setVersaoRespostas((atual) => atual + 1), [])

    return { postagem, ancestrais, setAncestrais, naoEncontrada, versaoRespostas, recarregarRespostas }
}
