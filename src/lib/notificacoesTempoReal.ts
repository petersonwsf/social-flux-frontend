import { aoSucessoDaApi } from './api'
import { criarStream, validarEvento, type EventoTempoReal, type StreamNotificacoes } from './notificacoesStream'

/**
 * Tempo real das notificações com UM stream por navegador (D10: aba líder). O navegador limita as conexões HTTP/1.1 por
 * origem (6), e cada aba com um stream prenderia uma delas. Uma única aba — a que obtém o Web Lock — abre o stream e repassa os
 * eventos às outras pelo BroadcastChannel; se ela fecha, o lock passa a outra aba, que assume o stream a partir do último
 * `seq` que viu. Sem Web Locks ou BroadcastChannel, cada aba abre o seu próprio stream.
 */

const NOME_LOCK = 'sf-notificacoes-lider'
const NOME_CANAL = 'sf-notificacoes'
/** Intervalo mínimo entre avisos de atividade às outras abas (uma ação do usuário costuma gerar várias respostas). */
const INTERVALO_ATIVIDADE_MS = 1_000

export interface TempoReal {
    parar: () => void
}

type MensagemCanal = { tipo: 'evento'; evento: EventoTempoReal } | { tipo: 'atividade' }

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null
}

/**
 * Liga o tempo real. `aoEvento` recebe os eventos tanto desta aba (quando ela é a líder) quanto das outras.
 * `seqInicial` é o maior `seq` já carregado pela listagem: o stream pede só o que mudou depois dele.
 */
export function iniciarTempoReal(aoEvento: (evento: EventoTempoReal) => void, seqInicial: number): TempoReal {
    let ultimoSeq = seqInicial
    let stream: StreamNotificacoes | null = null
    let parado = false
    let ultimoAvisoAtividade = 0
    const lider: { liberar?: () => void } = {}
    const cancelarEspera = new AbortController()
    const canal = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(NOME_CANAL)

    const registrar = (evento: EventoTempoReal) => {
        if (evento.tipo === 'notificacao') ultimoSeq = Math.max(ultimoSeq, evento.notificacao.seq)
    }

    const enviar = (mensagem: MensagemCanal) => canal?.postMessage(mensagem)

    if (canal) {
        canal.onmessage = (mensagem: MessageEvent<unknown>) => {
            const dado = mensagem.data
            if (!ehObjeto(dado)) return
            if (dado.tipo === 'atividade') {
                stream?.atividade()
            } else if (dado.tipo === 'evento') {
                const evento = validarEvento(dado.evento)
                if (!evento) return
                registrar(evento)
                aoEvento(evento)
            }
        }
    }

    const abrirStream = () => {
        stream = criarStream({
            ultimoSeq: () => ultimoSeq,
            aoEvento: (evento) => {
                registrar(evento)
                aoEvento(evento)
                enviar({ tipo: 'evento', evento })
            },
        })
    }

    const semBloqueios = typeof navigator === 'undefined' || !('locks' in navigator)
    if (semBloqueios) {
        abrirStream()
    } else {
        navigator.locks
            .request(NOME_LOCK, { signal: cancelarEspera.signal }, () => {
                if (parado) return Promise.resolve()
                // Líder até a aba fechar (o navegador solta o lock) ou `parar()` ser chamado.
                return new Promise<void>((resolver) => {
                    lider.liberar = resolver
                    abrirStream()
                })
            })
            .catch(() => undefined)
    }

    const deixarDeOuvirApi = aoSucessoDaApi(() => {
        if (stream) {
            stream.atividade()
            return
        }
        const agora = Date.now()
        if (agora - ultimoAvisoAtividade >= INTERVALO_ATIVIDADE_MS) {
            ultimoAvisoAtividade = agora
            enviar({ tipo: 'atividade' })
        }
    })

    return {
        parar: () => {
            parado = true
            deixarDeOuvirApi()
            cancelarEspera.abort()
            lider.liberar?.()
            stream?.parar()
            stream = null
            if (canal) {
                canal.onmessage = null
                canal.close()
            }
        },
    }
}
