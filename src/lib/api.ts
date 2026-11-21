import axios from 'axios'
import { API_URL } from '../config/env'
import { refreshSession, shouldRenewSession } from './session'

declare module 'axios' {
    interface AxiosRequestConfig {
        /** Rotas de autenticação que não devem disparar nem repetir renovação de sessão. */
        skipSessionRefresh?: boolean
        /** Interno: a requisição já foi repetida após renovar a sessão. */
        retriedAfterRefresh?: boolean
    }
}

/**
 * Instância única do axios usada por todos os services.
 * A sessão vive em cookies HttpOnly emitidos pelo authentication_service; `withCredentials` faz o navegador
 * enviá-los (o JavaScript nunca enxerga os tokens). Os interceptors renovam a sessão automaticamente.
 */
export const api = axios.create({ baseURL: API_URL, withCredentials: true })

type OuvinteSucesso = () => void
const ouvintesSucesso = new Set<OuvinteSucesso>()

/**
 * Avisa quando uma chamada de API dá certo (exceto as de autenticação e as que pedem `skipSessionRefresh`, como a sonda do
 * tempo real). O tempo real usa isso para saber que o usuário voltou a agir com a sessão válida e religar o stream, sem nunca
 * renovar a sessão por conta própria. Devolve a função que remove o ouvinte.
 */
export function aoSucessoDaApi(ouvinte: OuvinteSucesso): () => void {
    ouvintesSucesso.add(ouvinte)
    return () => {
        ouvintesSucesso.delete(ouvinte)
    }
}

let unauthorizedHandler: (() => void) | null = null

/** O AuthProvider registra aqui o que fazer quando a sessão não pode mais ser renovada. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
    unauthorizedHandler = handler
}

// Renovação proativa: se o usuário está agindo na janela de expiração, renova antes de enviar.
api.interceptors.request.use(async (config) => {
    if (!config.skipSessionRefresh && shouldRenewSession()) {
        await refreshSession()
    }
    return config
})

// 401: tenta renovar a sessão uma vez e repete a requisição; se não der, a sessão acabou.
api.interceptors.response.use(
    (response) => {
        if (!response.config.skipSessionRefresh) ouvintesSucesso.forEach((ouvinte) => ouvinte())
        return response
    },
    async (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && error.config) {
            const config = error.config
            if (!config.skipSessionRefresh && !config.retriedAfterRefresh) {
                config.retriedAfterRefresh = true
                if (await refreshSession()) {
                    return api.request(config)
                }
                unauthorizedHandler?.()
            }
        }
        return Promise.reject(error)
    },
)
