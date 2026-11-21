import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../lib/errors'
import type { PaginaRelacoes, UsuarioResumo } from '../types/api'

/**
 * Lista paginada por cursor (seguidores ou seguidos). A primeira página só é buscada quando `ativo` vira `true`
 * (ex.: o modal foi aberto); `carregarMais` busca a seguinte. Falhas (ex.: conta privada) ficam em `erro`, sem toast,
 * para o modal mostrar a mensagem no lugar da lista.
 */
export function useListaRelacoes(ativo: boolean, buscar: (cursor?: string) => Promise<PaginaRelacoes>) {
    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
    const [proximoCursor, setProximoCursor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const iniciou = useRef(false)
    const buscarRef = useRef(buscar)
    buscarRef.current = buscar

    const carregar = useCallback(async (cursor?: string) => {
        setCarregando(true)
        try {
            const pagina = await buscarRef.current(cursor)
            setUsuarios((atual) => [...atual, ...pagina.itens.map((item) => item.usuario)])
            setProximoCursor(pagina.proximoCursor)
            setErro(null)
        } catch (error) {
            setErro(getErrorMessage(error))
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        if (!ativo || iniciou.current) return
        iniciou.current = true
        void carregar()
    }, [ativo, carregar])

    const carregarMais = useCallback(() => {
        if (proximoCursor && !carregando) void carregar(proximoCursor)
    }, [proximoCursor, carregando, carregar])

    const remover = useCallback((id: string) => {
        setUsuarios((atual) => atual.filter((usuario) => usuario.id !== id))
    }, [])

    return { usuarios, temMais: proximoCursor !== null, carregando, erro, carregarMais, remover }
}
