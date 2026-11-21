import axios from 'axios'
import type { Mensagem } from '../types/api'

const FALLBACK = 'Não foi possível completar a requisição, tente novamente.'

function isMensagem(value: unknown): value is Mensagem {
    return typeof value === 'object' && value !== null && typeof (value as Mensagem).mensagem === 'string'
}

/** Extrai o texto de erro de qualquer falha (resposta do backend, rede, etc.). */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data: unknown = error.response?.data
        if (isMensagem(data)) return data.mensagem
        if (!error.response) return 'Sem conexão com o servidor.'
    }
    return FALLBACK
}

/** HTTP status de um erro do axios, quando existir. */
export function getErrorStatus(error: unknown): number | null {
    return axios.isAxiosError(error) ? (error.response?.status ?? null) : null
}
