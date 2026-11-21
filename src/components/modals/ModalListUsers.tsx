import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import type { UsuarioResumo } from '../../types/api'

interface ModalListUsersProps {
    id: string
    title: string
    users: UsuarioResumo[]
    msgDefault: string
    /** Mensagem de erro (ex.: conta privada): aparece no lugar da lista. */
    erro?: string | null
    /** Há mais páginas: mostra o botão "Carregar mais". */
    temMais?: boolean
    carregando?: boolean
    onCarregarMais?: () => void
    /** Quando informado, cada item ganha um botão "Remover" (ex.: remover seguidor). */
    onRemover?: (usuario: UsuarioResumo) => void
}

function ModalListUsers({
    id,
    title,
    users,
    msgDefault,
    erro,
    temMais = false,
    carregando = false,
    onCarregarMais,
    onRemover,
}: ModalListUsersProps) {
    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="display-6 mb-0">{title}</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div className="modal-body list-users">
                        {erro ? (
                            <div className="text-center">
                                <p className="lead">{erro}</p>
                            </div>
                        ) : users.length > 0 ? (
                            <>
                                {users.map((user) => (
                                    <div key={user.id} className="d-flex align-items-center justify-content-between my-3">
                                        <Link
                                            to={`/perfil/${user.username}`}
                                            className="d-flex align-items-center nav-link p-0 min-w-0"
                                            data-bs-dismiss="modal"
                                        >
                                            <Avatar user={user} size="50px" className="me-3" alt="" />
                                            <span className="text-truncate">{user.username}</span>
                                        </Link>
                                        {onRemover && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger ms-2"
                                                onClick={() => onRemover(user)}
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {temMais && (
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={onCarregarMais}
                                            disabled={carregando}
                                        >
                                            {carregando ? 'Carregando...' : 'Carregar mais'}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="lead">{carregando ? 'Carregando...' : msgDefault}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalListUsers
