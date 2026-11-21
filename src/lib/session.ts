import axios from 'axios'
import { API_URL } from '../config/env'
import type { RefreshResponse } from '../types/api'

/**
 * Temporização da sessão. O JWT fica em cookie HttpOnly (o JavaScript não consegue lê-lo), então o servidor
 * informa `expiresAt`/`renewAt` nas respostas de login/me/refresh e guardamos só isso, em memória.
 *
 * Regra de "sessão deslizante": a partir de `renewAt`, a próxima requisição do usuário dispara a renovação;
 * o servidor também aceita renovar por alguns minutos depois do vencimento. Ocioso além disso, o usuário volta ao login.
 */
interface Timing {
    renewAt: number
}

let timing: Timing | null = null

export function setSessionTiming(value: Pick<RefreshResponse, 'renewAt'> | null): void {
    timing = value ? { renewAt: new Date(value.renewAt).getTime() } : null
}

/** true quando já chegou a janela de renovação (e há uma sessão conhecida). */
export function shouldRenewSession(): boolean {
    return timing !== null && Date.now() >= timing.renewAt
}

// Cliente separado, sem interceptors, para não entrar em loop ao renovar.
const refreshClient = axios.create({ baseURL: API_URL, withCredentials: true })

let inFlight: Promise<boolean> | null = null

async function requestRefresh(): Promise<boolean> {
    try {
        const { data } = await refreshClient.post<RefreshResponse>('/auth/refresh')
        setSessionTiming(data)
        return true
    } catch {
        setSessionTiming(null)
        return false
    }
}

/**
 * Renova a sessão uma única vez, mesmo com várias requisições simultâneas na aba (single-flight) e com várias
 * abas abertas (Web Locks API). O servidor ainda tolera o reuso do refresh token por alguns segundos.
 */
export function refreshSession(): Promise<boolean> {
    if (inFlight) return inFlight

    const run = (): Promise<boolean> => requestRefresh()
    const locked = typeof navigator !== 'undefined' && 'locks' in navigator
        ? navigator.locks.request('sf-auth-refresh', run)
        : run()

    inFlight = locked.finally(() => {
        inFlight = null
    })
    return inFlight
}
