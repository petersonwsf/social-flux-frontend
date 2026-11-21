import { Link } from 'react-router-dom'
import type { EstadoRelacao } from '../../types/api'

interface ActionsProfileProps {
    ehProprioPerfil: boolean
    estado: EstadoRelacao
    onSeguir: () => void
    onCancelarSolicitacao: () => void
    /** Id do modal de confirmação para deixar de seguir. */
    modalDeixarDeSeguirId: string
}

function ActionsProfile({
    ehProprioPerfil,
    estado,
    onSeguir,
    onCancelarSolicitacao,
    modalDeixarDeSeguirId,
}: ActionsProfileProps) {
    if (ehProprioPerfil) {
        return (
            <Link to="/editar" className="btn btn-primary">
                Editar perfil
            </Link>
        )
    }

    if (estado === 'NENHUM') {
        return (
            <button type="button" className="btn btn-primary d-flex align-items-center" onClick={onSeguir}>
                <ion-icon name="person-add-outline"></ion-icon> Seguir
            </button>
        )
    }

    if (estado === 'SEGUINDO') {
        return (
            <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target={`#${modalDeixarDeSeguirId}`}
            >
                <ion-icon name="people-outline"></ion-icon> Seguindo
            </button>
        )
    }

    return (
        <button type="button" className="btn btn-secondary d-flex align-items-center" onClick={onCancelarSolicitacao}>
            Solicitado
        </button>
    )
}

export default ActionsProfile
