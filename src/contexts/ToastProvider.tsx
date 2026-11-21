import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastContextValue } from './toastContext'
import type { Mensagem } from '../types/api'

interface ToastItem extends Mensagem {
    id: number
}

const TOAST_DURATION_MS = 6000

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const notify = useCallback(
        (mensagem: Mensagem) => {
            const id = nextId.current++
            setToasts((current) => [...current, { ...mensagem, id }])
            window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
        },
        [dismiss],
    )

    const value = useMemo<ToastContextValue>(
        () => ({
            notify,
            success: (text) => notify({ mensagem: text, sucesso: true }),
            error: (text) => notify({ mensagem: text, sucesso: false }),
        }),
        [notify],
    )

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-stack" aria-live="polite">
                {toasts.map((toast) => (
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
                ))}
            </div>
        </ToastContext.Provider>
    )
}
