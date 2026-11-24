import { useCallback, useState } from 'react'
import * as postagemService from '../services/postagemService'
import { getErrorCode, getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { CriarPostagemPayload, Postagem } from '../types/api'

/** Código que o post_service devolve ao recusar texto ou imagem de automutilação. */
const CODIGO_AUTOMUTILACAO = 'conteudo_automutilacao'

/** Cria uma postagem (ou uma resposta, quando `pai` é informado). Devolve a postagem criada, ou `null` se falhou. */
export function useCriarPostagem(onCriada?: (postagem: Postagem) => void) {
    const toast = useToast()
    const [enviando, setEnviando] = useState(false)

    const criarPostagem = useCallback(
        async (values: CriarPostagemPayload, pai?: Postagem): Promise<Postagem | null> => {
            setEnviando(true)
            try {
                const criada = await postagemService.criar(values, pai?.id)
                toast.success(pai ? 'Comentário publicado' : 'Postagem publicada')
                onCriada?.(criada)
                return criada
            } catch (error) {
                if (getErrorCode(error) === CODIGO_AUTOMUTILACAO) {
                    toast.apoio(getErrorMessage(error))
                } else {
                    toast.error(getErrorMessage(error))
                }
                return null
            } finally {
                setEnviando(false)
            }
        },
        [toast, onCriada],
    )

    return { criarPostagem, enviando }
}

/** Exclui uma postagem e avisa o chamador para atualizar a tela. */
export function useExcluirPostagem(onExcluida: (id: string) => void) {
    const toast = useToast()

    return useCallback(
        async (id: string) => {
            try {
                await postagemService.remover(id)
                toast.success('Postagem excluída')
                onExcluida(id)
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [toast, onExcluida],
    )
}
