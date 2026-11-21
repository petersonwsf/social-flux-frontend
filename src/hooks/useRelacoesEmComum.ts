import { useEffect, useState } from 'react'
import * as relacaoService from '../services/relacaoService'
import { getErrorMessage } from '../lib/errors'
import { useToast } from './useToast'
import type { EmComum, Usuario } from '../types/api'

const VAZIO: EmComum = { itens: [], total: 0 }

/**
 * Quem o logado segue e também segue o outro usuário. `limite` restringe os itens trazidos (padrão: o máximo da API);
 * `total` é sempre o número real, então quem só precisa da contagem pode pedir `limite = 1`.
 */
export function useRelacoesEmComum(user: Usuario, outro: Usuario, limite = 100) {
    const toast = useToast()
    const [emComum, setEmComum] = useState<EmComum>(VAZIO)

    useEffect(() => {
        if (user.id === outro.id) return

        let ignore = false

        relacaoService
            .buscarEmComum(outro.id, limite)
            .then((resultado) => {
                if (!ignore) setEmComum(resultado)
            })
            .catch((error: unknown) => {
                if (!ignore) toast.error(getErrorMessage(error))
            })

        return () => {
            ignore = true
        }
    }, [user.id, outro.id, limite, toast])

    return emComum
}
