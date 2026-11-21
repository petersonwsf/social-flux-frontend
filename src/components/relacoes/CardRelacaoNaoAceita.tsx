import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import type { ItemRelacao } from '../../types/api'

interface CardRelacaoNaoAceitaProps {
    solicitacao: ItemRelacao
    onAceitar: (solicitacao: ItemRelacao) => void
    onRecusar: (solicitacao: ItemRelacao) => void
}

function CardRelacaoNaoAceita({ solicitacao, onAceitar, onRecusar }: CardRelacaoNaoAceitaProps) {
    const solicitante = solicitacao.usuario

    return (
        <div className="card-relacao d-flex justify-content-between align-items-center w-100">
            <Link to={`/perfil/${solicitante.username}`} className="nav-link d-flex align-items-center">
                <Avatar user={solicitante} size="30px" className="me-2" alt="" />
                {solicitante.username}
            </Link>
            <div className="d-flex">
                <button type="button" className="btn btn-icon text-success" onClick={() => onAceitar(solicitacao)} aria-label="Aceitar">
                    <ion-icon name="checkmark-outline"></ion-icon>
                </button>
                <button type="button" className="btn btn-icon text-danger" onClick={() => onRecusar(solicitacao)} aria-label="Recusar">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
        </div>
    )
}

export default CardRelacaoNaoAceita
