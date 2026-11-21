import { useCallback, useEffect, useState } from 'react'
import * as relacaoService from '../services/relacaoService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { ContagensRelacao, EstadoRelacao, Usuario, UsuarioResumo } from '../types/api'

const SEM_CONTAGENS: ContagensRelacao = { seguidores: 0, seguidos: 0 }

/**
 * Relação entre o usuário logado e o dono do perfil: estado (seguindo, solicitado ou nenhum), contadores e as ações
 * seguir, deixar de seguir/cancelar e remover seguidor. As listas de seguidores/seguidos são paginadas e carregadas
 * sob demanda por `useListaRelacoes`.
 */
export function useRelacao(user: Usuario, perfil: Usuario) {
    const toast = useToast()
    const ehProprioPerfil = user.id === perfil.id
    const [estado, setEstado] = useState<EstadoRelacao>('NENHUM')
    const [contagens, setContagens] = useState<ContagensRelacao>(SEM_CONTAGENS)

    useEffect(() => {
        let ignore = false

        const carregar = async () => {
            try {
                const [novasContagens, relacao] = await Promise.all([
                    relacaoService.buscarContagens(perfil.id),
                    ehProprioPerfil ? Promise.resolve(null) : relacaoService.buscarEstado(perfil.id),
                ])
                if (ignore) return
                setContagens(novasContagens)
                setEstado(relacao?.estado ?? 'NENHUM')
            } catch (error) {
                if (!ignore) toast.error(getErrorMessage(error))
            }
        }

        void carregar()
        return () => {
            ignore = true
        }
    }, [perfil.id, ehProprioPerfil, toast])

    const ajustarSeguidores = useCallback((delta: number) => {
        setContagens((atual) => ({ ...atual, seguidores: Math.max(0, atual.seguidores + delta) }))
    }, [])

    const seguir = useCallback(async () => {
        try {
            const novoEstado = await relacaoService.seguir(perfil.id)
            setEstado(novoEstado)
            if (novoEstado === 'SEGUINDO') {
                ajustarSeguidores(1)
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }, [perfil, ajustarSeguidores, toast])

    /** Deixa de seguir ou cancela a solicitação, conforme o estado atual. */
    const deixarDeSeguir = useCallback(async () => {
        try {
            await relacaoService.deixarDeSeguir(perfil.id)
            if (estado === 'SEGUINDO') ajustarSeguidores(-1)
            setEstado('NENHUM')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }, [perfil.id, estado, ajustarSeguidores, toast])

    /** Tira um seguidor da lista do próprio usuário. Devolve se deu certo (para o chamador atualizar a lista). */
    const removerSeguidor = useCallback(
        async (seguidor: UsuarioResumo): Promise<boolean> => {
            try {
                await relacaoService.removerSeguidor(seguidor.id)
                ajustarSeguidores(-1)
                return true
            } catch (error) {
                toast.error(getErrorMessage(error))
                return false
            }
        },
        [ajustarSeguidores, toast],
    )

    return { estado, contagens, seguir, deixarDeSeguir, removerSeguidor }
}
