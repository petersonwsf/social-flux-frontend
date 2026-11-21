import { useEffect, useState } from 'react'

/**
 * Diz se o modal do Bootstrap com este id já foi aberto alguma vez (fica `true` depois da primeira abertura).
 * Serve para carregar o conteúdo do modal só quando alguém realmente o abre.
 */
export function useModalAberto(id: string): boolean {
    const [aberto, setAberto] = useState(false)

    useEffect(() => {
        const aoAbrir = (evento: Event) => {
            if (evento.target instanceof HTMLElement && evento.target.id === id) setAberto(true)
        }
        document.addEventListener('show.bs.modal', aoAbrir)
        return () => document.removeEventListener('show.bs.modal', aoAbrir)
    }, [id])

    return aberto
}
