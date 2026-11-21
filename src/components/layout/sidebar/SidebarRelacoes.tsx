import ListaRelacoesNaoAceitas from '../../relacoes/ListaRelacoesNaoAceitas'
import SidebarBackLink from './SidebarBackLink'
import type { ItemRelacao } from '../../../types/api'

interface SidebarRelacoesProps {
    solicitacoes: ItemRelacao[]
    temMais: boolean
    onVoltar: () => void
    onCarregarMais: () => void
    onAceitar: (solicitacao: ItemRelacao) => void
    onRecusar: (solicitacao: ItemRelacao) => void
}

function SidebarRelacoes({ solicitacoes, temMais, onVoltar, onCarregarMais, onAceitar, onRecusar }: SidebarRelacoesProps) {
    return (
        <div>
            <SidebarBackLink onClick={onVoltar} />
            <ListaRelacoesNaoAceitas
                solicitacoes={solicitacoes}
                temMais={temMais}
                onCarregarMais={onCarregarMais}
                onAceitar={onAceitar}
                onRecusar={onRecusar}
            />
        </div>
    )
}

export default SidebarRelacoes
