import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NotificationsContext, type NotificationsContextValue } from './notificationsContext'
import { getErrorMessage } from '../lib/errors'
import { iniciarTempoReal } from '../lib/notificacoesTempoReal'
import type { EventoTempoReal } from '../lib/notificacoesStream'
import { fraseDaNotificacao } from '../lib/notificacoesTexto'
import * as notificationService from '../services/notificationService'
import * as relacaoService from '../services/relacaoService'
import { useCurrentUser } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import type { Notificacao } from '../types/api'

/** Só vira toast o que aconteceu agora: o reenvio ao reconectar não deve despejar avisos antigos. */
const IDADE_MAXIMA_TOAST_MS = 30_000

function maiorSeq(lista: Notificacao[]): number {
    return lista.reduce((maior, item) => Math.max(maior, item.seq), 0)
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const user = useCurrentUser()
    const toast = useToast()
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [naoVistas, setNaoVistas] = useState(0)
    const [proximoCursor, setProximoCursor] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)
    const areasAbertas = useRef(0)
    const notificacoesRef = useRef<Notificacao[]>([])

    useEffect(() => {
        notificacoesRef.current = notificacoes
    }, [notificacoes])

    const recarregar = useCallback(
        async (ignorar?: () => boolean): Promise<Notificacao[] | null> => {
            try {
                const [pagina, total] = await Promise.all([notificationService.listar(), notificationService.contarNaoVistas()])
                if (ignorar?.()) return null
                setNotificacoes(pagina.itens)
                setProximoCursor(pagina.proximoCursor)
                setNaoVistas(areasAbertas.current > 0 ? 0 : total)
                return pagina.itens
            } catch (error) {
                if (!ignorar?.()) toast.error(getErrorMessage(error))
                return null
            }
        },
        [toast],
    )

    const aoEvento = useCallback(
        (evento: EventoTempoReal) => {
            switch (evento.tipo) {
                case 'contagem':
                    setNaoVistas(areasAbertas.current > 0 ? 0 : evento.naoVistas)
                    break
                case 'notificacao': {
                    const nova = evento.notificacao
                    // Um grupo alterado substitui o anterior (mesmo id) e sobe ao topo.
                    setNotificacoes((lista) => [nova, ...lista.filter((item) => item.id !== nova.id)])
                    const recente = Date.now() - Date.parse(nova.atualizada_em) < IDADE_MAXIMA_TOAST_MS
                    if (!nova.vista && recente && areasAbertas.current === 0) {
                        toast.notify({ mensagem: fraseDaNotificacao(nova), sucesso: true })
                    }
                    break
                }
                case 'removida':
                    setNotificacoes((lista) => lista.filter((item) => item.id !== evento.id))
                    break
                case 'recarregar':
                    void recarregar()
                    break
            }
        },
        [toast, recarregar],
    )

    // Carrega a primeira página e liga o tempo real; no logout (ou ao trocar de usuário) tudo é desligado.
    useEffect(() => {
        let ignore = false
        let tempoReal: { parar: () => void } | null = null

        void recarregar(() => ignore).then((itens) => {
            if (ignore || itens === null) return
            tempoReal = iniciarTempoReal(aoEvento, maiorSeq(itens))
        })

        return () => {
            ignore = true
            tempoReal?.parar()
        }
    }, [user.id, recarregar, aoEvento])

    const carregarMais = useCallback(() => {
        if (!proximoCursor || carregando) return
        setCarregando(true)
        notificationService
            .listar(proximoCursor)
            .then((pagina) => {
                setNotificacoes((lista) => {
                    const existentes = new Set(lista.map((item) => item.id))
                    return [...lista, ...pagina.itens.filter((item) => !existentes.has(item.id))]
                })
                setProximoCursor(pagina.proximoCursor)
            })
            .catch((error: unknown) => toast.error(getErrorMessage(error)))
            .finally(() => setCarregando(false))
    }, [proximoCursor, carregando, toast])

    const zerarContador = useCallback(() => setNaoVistas(0), [])

    const marcarComoVistas = useCallback(() => {
        const lista = notificacoesRef.current
        if (!lista.some((item) => !item.vista)) return
        const ate = maiorSeq(lista)
        notificationService
            .marcarComoVistas(ate)
            .then(() => setNotificacoes((atual) => atual.map((item) => (item.seq <= ate ? { ...item, vista: true } : item))))
            .catch((error: unknown) => toast.error(getErrorMessage(error)))
    }, [toast])

    const abrirArea = useCallback(() => {
        areasAbertas.current += 1
        setNaoVistas(0)
        return () => {
            areasAbertas.current = Math.max(0, areasAbertas.current - 1)
        }
    }, [])

    const aceitarSolicitacao = useCallback(
        async (notificacao: Notificacao) => {
            const solicitante = notificacao.atores[0]
            if (!solicitante) return
            try {
                await relacaoService.aceitarSolicitacao(solicitante.id)
                setNotificacoes((lista) => lista.filter((item) => item.id !== notificacao.id))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [toast],
    )

    const recusarSolicitacao = useCallback(
        async (notificacao: Notificacao) => {
            const solicitante = notificacao.atores[0]
            if (!solicitante) return
            try {
                await relacaoService.recusarSolicitacao(solicitante.id)
                setNotificacoes((lista) => lista.filter((item) => item.id !== notificacao.id))
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        [toast],
    )

    const value = useMemo<NotificationsContextValue>(
        () => ({
            notificacoes,
            naoVistas,
            temMais: proximoCursor !== null,
            carregando,
            carregarMais,
            zerarContador,
            marcarComoVistas,
            abrirArea,
            aceitarSolicitacao,
            recusarSolicitacao,
        }),
        [
            notificacoes,
            naoVistas,
            proximoCursor,
            carregando,
            carregarMais,
            zerarContador,
            marcarComoVistas,
            abrirArea,
            aceitarSolicitacao,
            recusarSolicitacao,
        ],
    )

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
