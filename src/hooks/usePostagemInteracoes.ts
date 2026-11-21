import { useCallback, useState } from 'react'
import { useCurtidas } from './useCurtidas'
import { useCriarPostagem } from './usePostagemActions'
import type { CriarPostagemPayload, Postagem } from '../types/api'

/**
 * Curtidas, contagem de respostas e formulário de comentário de um card de postagem. Os contadores já vêm na postagem
 * (nenhuma chamada extra por card); comentar soma 1 localmente.
 */
export function usePostagemInteracoes(postagem: Postagem, onResposta?: () => void) {
    const curtidas = useCurtidas(postagem)
    const [totalRespostas, setTotalRespostas] = useState(postagem.respostas)
    const [comentando, setComentando] = useState(false)

    const handleCriada = useCallback(() => {
        setTotalRespostas((atual) => atual + 1)
        setComentando(false)
        onResposta?.()
    }, [onResposta])

    const { criarPostagem } = useCriarPostagem(handleCriada)

    const comentar = useCallback(
        async (values: CriarPostagemPayload) => {
            await criarPostagem(values, postagem)
        },
        [criarPostagem, postagem],
    )

    return {
        curtidas,
        respostas: { total: totalRespostas },
        comentando,
        alternarComentario: () => setComentando((atual) => !atual),
        comentar,
    }
}
