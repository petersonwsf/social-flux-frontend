import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Loading from '../common/Loading'
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
    /** Texto do campo de busca. Com `onBuscaChange`, o campo aparece no topo; quem usa o modal faz a busca (com debounce). */
    busca?: string
    onBuscaChange?: (busca: string) => void
    /** Busca em andamento (debounce ou requisição): mostra o loading pequeno no lugar da lista. */
    buscando?: boolean
}

/** Modal (altura total da tela) com a lista de usuários: avatar, username e nome, busca opcional e paginação. */
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
    busca = '',
    onBuscaChange,
    buscando = false,
}: ModalListUsersProps) {
    const mostrarBusca = onBuscaChange !== undefined && (!erro || busca !== '')

    const renderLista = () => {
        if (buscando) {
            return (
                <div className="d-flex justify-content-center">
                    <Loading width="48px" />
                </div>
            )
        }
        if (erro) {
            return (
                <div className="text-center">
                    <p className="lead">{erro}</p>
                </div>
            )
        }
        if (users.length === 0) {
            return (
                <div className="text-center">
                    <p className="lead">
                        {carregando ? 'Carregando...' : busca.trim() ? 'Nenhum usuário encontrado' : msgDefault}
                    </p>
                </div>
            )
        }
        return (
            <>
                <div className="d-flex flex-column gap-3">
                    {users.map((user) => (
                        <div key={user.id} className="d-flex align-items-center justify-content-between">
                            <Link
                                to={`/perfil/${user.username}`}
                                className="d-flex align-items-center nav-link p-0 min-w-0"
                                data-bs-dismiss="modal"
                            >
                                <Avatar user={user} size="40px" className="me-2" alt="" />
                                <span className="d-flex flex-column min-w-0 lh-sm">
                                    <span className="small fw-semibold text-truncate">{user.username}</span>
                                    <span className="small text-secondary text-truncate">{user.nome}</span>
                                </span>
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
                </div>
                {temMais && (
                    <div className="text-center mt-3">
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
        )
    }

    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-lista-usuarios">
                <div className="modal-content h-100">
                    <div className="modal-header position-relative justify-content-center">
                        <p className="fs-5 fw-semibold text-center mb-0">{title}</p>
                        <button
                            type="button"
                            className="btn-close position-absolute end-0 me-3"
                            data-bs-dismiss="modal"
                            aria-label="Fechar"
                        ></button>
                    </div>
                    <div className="modal-body list-users">
                        {mostrarBusca && (
                            <input
                                type="search"
                                className="form-control form-control-sm mb-4"
                                placeholder="Buscar por nome ou username"
                                aria-label={`Buscar em ${title}`}
                                value={busca}
                                onChange={(event) => onBuscaChange(event.target.value)}
                            />
                        )}
                        {renderLista()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalListUsers
