import { useContext } from 'react'
import { NotificationsContext, type NotificationsContextValue } from '../contexts/notificationsContext'

export function useNotificacoes(): NotificationsContextValue {
    const context = useContext(NotificationsContext)
    if (!context) throw new Error('useNotificacoes deve ser usado dentro de <NotificationsProvider>')
    return context
}
