import CardRelacaoNaoAceita from './CardRelacaoNaoAceita'
import type { ItemRelacao } from '../../types/api'

interface ListaRelacoesNaoAceitasProps {
    solicitacoes: ItemRelacao[]
    onAceitar: (solicitacao: ItemRelacao) => void
    onRecusar: (solicitacao: ItemRelacao) => void
    /** Há mais páginas de solicitações: mostra o botão "Carregar mais". */
    temMais?: boolean
    onCarregarMais?: () => void
}

function ListaRelacoesNaoAceitas({
    solicitacoes,
    onAceitar,
    onRecusar,
    temMais = false,
    onCarregarMais,
}: ListaRelacoesNaoAceitasProps) {
    if (solicitacoes.length === 0) {
        return (
            <div className="text-center px-3">
                <p className="lead">Não há solicitações de amizade</p>
            </div>
        )
    }

    return (
        <>
            <ul className="nav nav-pills flex-column mt-1">
                {solicitacoes.map((solicitacao) => (
                    <li key={solicitacao.usuario.id}>
                        <CardRelacaoNaoAceita solicitacao={solicitacao} onAceitar={onAceitar} onRecusar={onRecusar} />
                    </li>
                ))}
            </ul>
            {temMais && (
                <div className="text-center mt-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={onCarregarMais}>
                        Carregar mais
                    </button>
                </div>
            )}
        </>
    )
}

export default ListaRelacoesNaoAceitas
