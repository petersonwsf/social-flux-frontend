import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../lib/errors'
import type { PaginaRelacoes, UsuarioResumo } from '../types/api'

const DEBOUNCE_PADRAO_MS = 1000

/**
 * Lista paginada por cursor (seguidores ou seguidos) com busca no servidor. A primeira página só é buscada quando
 * `ativo` vira `true` (ex.: o modal foi aberto); `carregarMais` busca a seguinte. Digitar em `busca` espera
 * `debounceMs` sem novas teclas e então recomeça a lista com o termo (a busca vale também para quem ainda não foi
 * carregado); `buscando` fica ativo da digitação até a resposta. Falhas (ex.: conta privada) ficam em `erro`, sem toast,
 * para o modal mostrar a mensagem no lugar da lista.
 */
export function useListaRelacoes(
    ativo: boolean,
    buscar: (busca: string, cursor?: string) => Promise<PaginaRelacoes>,
    debounceMs: number = DEBOUNCE_PADRAO_MS,
) {
    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
    const [proximoCursor, setProximoCursor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [busca, setBusca] = useState('')
    const [buscaAplicada, setBuscaAplicada] = useState('')
    const [recarregando, setRecarregando] = useState(false)
    const iniciou = useRef(false)
    // Só a resposta da última requisição vale: uma busca nova invalida as que ainda estão a caminho.
    const geracao = useRef(0)
    const buscarRef = useRef(buscar)
    buscarRef.current = buscar

    const carregar = useCallback(async (termo: string, cursor?: string) => {
        const minha = ++geracao.current
        setCarregando(true)
        try {
            const pagina = await buscarRef.current(termo, cursor)
            if (minha !== geracao.current) return
            const itens = pagina.itens.map((item) => item.usuario)
            setUsuarios((atual) => (cursor ? [...atual, ...itens] : itens))
            setProximoCursor(pagina.proximoCursor)
            setErro(null)
        } catch (error) {
            if (minha === geracao.current) setErro(getErrorMessage(error))
        } finally {
            if (minha === geracao.current) {
                setCarregando(false)
                setRecarregando(false)
            }
        }
    }, [])

    useEffect(() => {
        if (!ativo || iniciou.current) return
        iniciou.current = true
        void carregar('')
    }, [ativo, carregar])

    useEffect(() => {
        if (!iniciou.current) return
        const termo = busca.trim()
        if (termo === buscaAplicada) return
        const espera = setTimeout(() => {
            setBuscaAplicada(termo)
            setRecarregando(true)
            void carregar(termo)
        }, debounceMs)
        return () => clearTimeout(espera)
    }, [busca, buscaAplicada, debounceMs, carregar])

    const carregarMais = useCallback(() => {
        if (proximoCursor && !carregando) void carregar(buscaAplicada, proximoCursor)
    }, [proximoCursor, carregando, carregar, buscaAplicada])

    const remover = useCallback((id: string) => {
        setUsuarios((atual) => atual.filter((usuario) => usuario.id !== id))
    }, [])

    const buscando = busca.trim() !== buscaAplicada || recarregando

    return { usuarios, temMais: proximoCursor !== null, carregando, erro, carregarMais, remover, busca, setBusca, buscando }
}
