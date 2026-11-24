import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastContextValue } from './toastContext'
import ToastNotificacao from '../components/notifications/ToastNotificacao'
import type { Mensagem, Notificacao } from '../types/api'

type ToastItem =
    | ({ id: number; tipo: 'mensagem' } & Mensagem)
    | { id: number; tipo: 'notificacao'; notificacao: Notificacao }

const TOAST_DURATION_MS = 6000

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const adicionar = useCallback(
        (criar: (id: number) => ToastItem) => {
            const id = nextId.current++
            setToasts((current) => [...current, criar(id)])
            window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
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

    const value = useMemo<ToastContextValue>(
        () => ({
            notify,
            notificar,
            success: (text) => notify({ mensagem: text, sucesso: true }),
            error: (text) => notify({ mensagem: text, sucesso: false }),
        }),
        [notify, notificar],
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
