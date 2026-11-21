import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import * as postagemService from '../services/postagemService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { PaginaPostagens, Postagem } from '../types/api'

export interface PostagensPaginadas {
    postagens: Postagem[]
    setPostagens: Dispatch<SetStateAction<Postagem[]>>
    /** Primeira página ainda carregando. */
    carregando: boolean
    /** Uma página seguinte está sendo buscada. */
    carregandoMais: boolean
    temMais: boolean
    carregarMais: () => void
}

/**
 * Lista de postagens paginada por cursor. Recarrega do zero quando `deps` mudam; `carregarMais` busca a página seguinte
 * (ignora cliques repetidos enquanto uma busca está em andamento). Respostas atrasadas de buscas antigas são descartadas.
 */
function usePostagensPaginadas(
    buscar: (cursor?: string) => Promise<PaginaPostagens>,
    deps: readonly unknown[],
): PostagensPaginadas {
    const toast = useToast()
    const [postagens, setPostagens] = useState<Postagem[]>([])
    const [proximoCursor, setProximoCursor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [carregandoMais, setCarregandoMais] = useState(false)
    const geracao = useRef(0)
    const buscarRef = useRef(buscar)
    buscarRef.current = buscar

    useEffect(() => {
        const atual = ++geracao.current
        setCarregando(true)
        setPostagens([])
        setProximoCursor(null)

        buscarRef.current()
            .then((pagina) => {
                if (atual !== geracao.current) return
                setPostagens(pagina.itens)
                setProximoCursor(pagina.proximoCursor)
            })
            .catch((error: unknown) => {
                if (atual === geracao.current) toast.error(getErrorMessage(error))
            })
            .finally(() => {
                if (atual === geracao.current) setCarregando(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast, ...deps])

    const carregarMais = useCallback(() => {
        if (!proximoCursor || carregandoMais) return
        const atual = geracao.current
        setCarregandoMais(true)
        buscarRef.current(proximoCursor)
            .then((pagina) => {
                if (atual !== geracao.current) return
                setPostagens((lista) => {
                    const vistos = new Set(lista.map((postagem) => postagem.id))
                    return [...lista, ...pagina.itens.filter((postagem) => !vistos.has(postagem.id))]
                })
                setProximoCursor(pagina.proximoCursor)
            })
            .catch((error: unknown) => {
                if (atual === geracao.current) toast.error(getErrorMessage(error))
            })
            .finally(() => {
                if (atual === geracao.current) setCarregandoMais(false)
            })
    }, [proximoCursor, carregandoMais, toast])

    return { postagens, setPostagens, carregando, carregandoMais, temMais: proximoCursor !== null, carregarMais }
}

/** Postagens das pessoas seguidas pelo usuário logado. */
export function useFeed() {
    return usePostagensPaginadas((cursor) => postagemService.buscarFeed(cursor), [])
}

/** Postagens de um usuário (`autor` = UUID da conta) conforme a aba. */
export function usePostagensUsuario(autor: string, filtro: postagemService.FiltroPostagensUsuario) {
    return usePostagensPaginadas((cursor) => postagemService.buscarDoUsuario(autor, filtro, cursor), [autor, filtro])
}

/** Respostas de uma postagem; mudar `versao` recarrega a lista (ex.: depois de comentar). */
export function useRespostas(idPostagem: string, versao = 0) {
    return usePostagensPaginadas((cursor) => postagemService.buscarRespostas(idPostagem, cursor), [idPostagem, versao])
}
