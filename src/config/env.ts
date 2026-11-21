// Centraliza as variáveis de ambiente (definidas em .env / build args do Docker).
const trimSlash = (value: string): string => value.replace(/\/+$/, '')

/**
 * URL base do gateway. Vazio (padrão) = mesma origem: o navegador chama /auth e /api no próprio host
 * (Caddy em produção; proxy do Vite em desenvolvimento). Os cookies de sessão HttpOnly dependem disso.
 */
export const API_URL = trimSlash(import.meta.env.VITE_API_URL ?? '')
export const API_BASE_URL = `${API_URL}/api`
