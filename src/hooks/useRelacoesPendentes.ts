import { useCallback, useEffect, useState } from 'react'
import * as relacaoService from '../services/relacaoService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { ItemRelacao, Usuario } from '../types/api'

/**
 * Solicitações de seguir recebidas pelo usuário (paginadas), com ações de aceitar/recusar. `total` é o número real de
 * pendentes (vem do servidor), mesmo que só a primeira página esteja carregada; cai um a cada aceite/recusa.
 */
export function useRelacoesPendentes(user: Usuario) {
    const toast = useToast()
    const [pendentes, setPendentes] = useState<ItemRelacao[]>([])
    const [total, setTotal] = useState(0)
    const [proximoCursor, setProximoCursor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)

    const carregar = useCallback(
        async (cursor?: string, ignorar?: () => boolean) => {
            setCarregando(true)
            try {
                const pagina = await relacaoService.listarSolicitacoes(cursor)
                if (ignorar?.()) return
                setPendentes((atual) => (cursor ? [...atual, ...pagina.itens] : pagina.itens))
                setProximoCursor(pagina.proximoCursor)
                setTotal(pagina.total)
            } catch (error) {
                if (!ignorar?.()) toast.error(getErrorMessage(error))
            } finally {
                if (!ignorar?.()) setCarregando(false)
            }
        },
        [toast],
    )

    useEffect(() => {
        let ignore = false
        void carregar(undefined, () => ignore)
        return () => {
            ignore = true
        }
    }, [user.id, carregar])

    const carregarMais = useCallback(() => {
        if (proximoCursor && !carregando) void carregar(proximoCursor)
    }, [proximoCursor, carregando, carregar])

    const aceitar = useCallback(
        async (item: ItemRelacao) => {
            try {
                await relacaoService.aceitarSolicitacao(item.usuario.id)
                setPendentes((lista) => lista.filter((outro) => outro.usuario.id !== item.usuario.id))
                setTotal((atual) => Math.max(0, atual - 1))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [toast],
    )

    const recusar = useCallback(
        async (item: ItemRelacao) => {
            try {
                await relacaoService.recusarSolicitacao(item.usuario.id)
                setPendentes((lista) => lista.filter((outro) => outro.usuario.id !== item.usuario.id))
                setTotal((atual) => Math.max(0, atual - 1))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [toast],
    )

    return { pendentes, total, temMais: proximoCursor !== null, carregarMais, aceitar, recusar }
}
