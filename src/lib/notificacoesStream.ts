import axios from 'axios'
import { API_URL } from '../config/env'
import * as notificationService from '../services/notificationService'
import type { AtorNotificacao, Notificacao, NotificacaoTipo } from '../types/api'

/** Eventos do stream SSE (`GET /api/notificacoes/stream`) já validados. */
export type EventoTempoReal =
    | { tipo: 'contagem'; naoVistas: number }
    | { tipo: 'notificacao'; notificacao: Notificacao }
    | { tipo: 'removida'; id: string }
    | { tipo: 'recarregar' }

export interface StreamNotificacoes {
    /** O usuário voltou a agir com a sessão válida: se o stream estava parado por 401, reconecta. */
    atividade: () => void
    parar: () => void
}

interface OpcoesStream {
    aoEvento: (evento: EventoTempoReal) => void
    /** Último `seq` conhecido: a reconexão pede ao servidor o que mudou depois dele. */
    ultimoSeq: () => number
}

type Estado = 'desligado' | 'conectando' | 'aberto' | 'espera' | 'aguardando-atividade'

const URL_STREAM = `${API_URL}/api/notificacoes/stream`
/** Espera entre tentativas depois de uma queda (com variação de ±25%). */
const ESPERAS_MS = [1_000, 2_000, 5_000, 10_000, 30_000, 60_000]
/** Fim planejado do stream (`encerrado`): reconecta em 0–2 s para os clientes não voltarem todos juntos. */
const VARIACAO_RECONEXAO_MS = 2_000

const TIPOS: ReadonlySet<string> = new Set<NotificacaoTipo>(['LIKE', 'REPLY', 'FOLLOW', 'FOLLOW_REQUEST', 'FOLLOW_ACCEPTED'])

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null
}

function ehAtor(valor: unknown): valor is AtorNotificacao {
    return ehObjeto(valor) && typeof valor.id === 'string' && typeof valor.username === 'string' && typeof valor.nome === 'string'
}

function ehNotificacao(valor: unknown): valor is Notificacao {
    return (
        ehObjeto(valor) &&
        typeof valor.id === 'string' &&
        typeof valor.seq === 'number' &&
        typeof valor.tipo === 'string' &&
        TIPOS.has(valor.tipo) &&
        Array.isArray(valor.atores) &&
        valor.atores.every(ehAtor) &&
        typeof valor.totalAtores === 'number' &&
        typeof valor.atualizada_em === 'string' &&
        typeof valor.vista === 'boolean'
    )
}

/** Monta o evento a partir do nome do evento SSE e do `data` já convertido de JSON; `null` se for desconhecido ou inválido. */
function montarEvento(nome: string, dado: unknown): EventoTempoReal | null {
    switch (nome) {
        case 'contagem':
            return ehObjeto(dado) && typeof dado.naoVistas === 'number' ? { tipo: 'contagem', naoVistas: dado.naoVistas } : null
        case 'notificacao':
            return ehNotificacao(dado) ? { tipo: 'notificacao', notificacao: dado } : null
        case 'removida':
            return ehObjeto(dado) && typeof dado.id === 'string' ? { tipo: 'removida', id: dado.id } : null
        case 'recarregar':
            return { tipo: 'recarregar' }
        default:
            return null
    }
}

/** Valida um evento que veio de outra aba (BroadcastChannel). */
export function validarEvento(valor: unknown): EventoTempoReal | null {
    if (!ehObjeto(valor) || typeof valor.tipo !== 'string') return null
    switch (valor.tipo) {
        case 'contagem':
            return montarEvento('contagem', valor)
        case 'notificacao':
            return montarEvento('notificacao', valor.notificacao)
        case 'removida':
            return montarEvento('removida', valor)
        case 'recarregar':
            return montarEvento('recarregar', valor)
        default:
            return null
    }
}

function lerJson(texto: unknown): unknown {
    try {
        return JSON.parse(String(texto)) as unknown
    } catch {
        return null
    }
}

/**
 * Mantém UM stream SSE aberto e o reabre quando cai. O `EventSource` nativo não diz o status HTTP de uma falha, então a
 * reconexão é nossa:
 * <ul>
 *   <li>`encerrado` (fim planejado, a cada ~15 min): reconecta já;</li>
 *   <li>erro/queda: uma SONDA (`GET /nao-vistas` sem renovar a sessão) descobre o motivo — 200: foi só a rede, reconecta com
 *   espera crescente; 401: a sessão venceu ou foi revogada, o stream PARA e só volta quando o usuário agir (`atividade`).</li>
 * </ul>
 * Nada aqui renova a sessão: uma aba esquecida aberta nunca mantém o login vivo.
 */
export function criarStream({ aoEvento, ultimoSeq }: OpcoesStream): StreamNotificacoes {
    let estado: Estado = 'conectando'
    let fonte: EventSource | null = null
    let temporizador: number | undefined
    let falhas = 0

    const fechar = () => {
        fonte?.close()
        fonte = null
        window.clearTimeout(temporizador)
        temporizador = undefined
    }

    const esperar = (ms: number) => {
        window.clearTimeout(temporizador)
        estado = 'espera'
        temporizador = window.setTimeout(conectar, ms)
    }

    const proximaEspera = (): number => {
        const base = ESPERAS_MS[Math.min(falhas, ESPERAS_MS.length - 1)] ?? 60_000
        falhas += 1
        return Math.round(base * (0.75 + Math.random() * 0.5))
    }

    const desligado = (): boolean => estado === 'desligado'

    const sondar = async () => {
        estado = 'espera'
        try {
            const naoVistas = await notificationService.contarNaoVistas({ semRenovar: true })
            if (desligado()) return
            aoEvento({ tipo: 'contagem', naoVistas })
        } catch (erro) {
            if (desligado()) return
            if (axios.isAxiosError(erro) && erro.response?.status === 401) {
                estado = 'aguardando-atividade'
                return
            }
        }
        esperar(proximaEspera())
    }

    function conectar() {
        if (estado === 'desligado') return
        fechar()
        estado = 'conectando'
        const desde = ultimoSeq()
        const origem = new EventSource(desde > 0 ? `${URL_STREAM}?desde=${desde}` : URL_STREAM, { withCredentials: true })
        fonte = origem
        let encerradoPeloServidor = false

        origem.onopen = () => {
            estado = 'aberto'
            falhas = 0
        }
        for (const nome of ['contagem', 'notificacao', 'removida', 'recarregar']) {
            origem.addEventListener(nome, (evento) => {
                const montado = montarEvento(nome, lerJson((evento as MessageEvent).data))
                if (montado) aoEvento(montado)
            })
        }
        origem.addEventListener('encerrado', () => {
            encerradoPeloServidor = true
            origem.close()
            if (fonte === origem) fonte = null
            esperar(Math.random() * VARIACAO_RECONEXAO_MS)
        })
        origem.onerror = () => {
            if (encerradoPeloServidor) return
            origem.close()
            if (fonte === origem) fonte = null
            void sondar()
        }
    }

    conectar()

    return {
        atividade: () => {
            if (estado !== 'aguardando-atividade') return
            falhas = 0
            conectar()
        },
        parar: () => {
            estado = 'desligado'
            fechar()
        },
    }
}
