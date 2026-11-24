import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastContextValue } from './toastContext'
import ToastApoio from '../components/common/ToastApoio'
import ToastNotificacao from '../components/notifications/ToastNotificacao'
import type { Mensagem, Notificacao } from '../types/api'

type ToastItem =
    | ({ id: number; tipo: 'mensagem' } & Mensagem)
    | { id: number; tipo: 'notificacao'; notificacao: Notificacao }
    | { id: number; tipo: 'apoio'; mensagem: string }

const TOAST_DURATION_MS = 6000
/** A mensagem de apoio fica mais tempo: a pessoa precisa de tempo para ler e para ligar ou abrir o link. */
const TOAST_APOIO_DURATION_MS = 30000

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const adicionar = useCallback(
        (criar: (id: number) => ToastItem, duracaoMs = TOAST_DURATION_MS) => {
            const id = nextId.current++
            setToasts((current) => [...current, criar(id)])
            window.setTimeout(() => dismiss(id), duracaoMs)
        },
        [dismiss],
    )

    const notify = useCallback(
        (mensagem: Mensagem) => adicionar((id) => ({ ...mensagem, id, tipo: 'mensagem' })),
        [adicionar],
    )

    const notificar = useCallback(
        (notificacao: Notificacao) => adicionar((id) => ({ id, tipo: 'notificacao', notificacao })),
        [adicionar],
    )

    const apoio = useCallback(
        (mensagem: string) => adicionar((id) => ({ id, tipo: 'apoio', mensagem }), TOAST_APOIO_DURATION_MS),
        [adicionar],
    )

    const value = useMemo<ToastContextValue>(
        () => ({
            notify,
            notificar,
            apoio,
            success: (text) => notify({ mensagem: text, sucesso: true }),
            error: (text) => notify({ mensagem: text, sucesso: false }),
        }),
        [notify, notificar, apoio],
    )

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-stack" aria-live="polite">
                {toasts.map((toast) =>
                    toast.tipo === 'notificacao' ? (
                        <ToastNotificacao
                            key={toast.id}
                            notificacao={toast.notificacao}
                            duracaoMs={TOAST_DURATION_MS}
                            onFechar={() => dismiss(toast.id)}
                        />
                    ) : toast.tipo === 'apoio' ? (
                        <ToastApoio key={toast.id} mensagem={toast.mensagem} onFechar={() => dismiss(toast.id)} />
                    ) : (
                        <div
                            key={toast.id}
                            className={`toast show align-items-center border-0 text-bg-${toast.sucesso ? 'success' : 'danger'}`}
                            role="alert"
                        >
                            <div className="d-flex">
                                <div className="toast-body">{toast.mensagem}</div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white me-2 m-auto"
                                    aria-label="Fechar"
                                    onClick={() => dismiss(toast.id)}
                                />
                            </div>
                        </div>
                    ),
                )}
            </div>
        </ToastContext.Provider>
    )
}
