import { Link } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useAuth'
import { useRelacoesEmComum } from '../../hooks/useRelacoesEmComum'
import Avatar from '../common/Avatar'
import type { Usuario } from '../../types/api'

function CardUsuarioSearch({ userSearched }: { userSearched: Usuario }) {
    const user = useCurrentUser()
    const { total: emComum } = useRelacoesEmComum(user, userSearched, 1)

    return (
        <li className="my-1">
            <Link to={`/perfil/${userSearched.username}`} className="nav-link d-flex align-items-center">
                <Avatar user={userSearched} className="foto-search me-3" />
                <div className="d-flex flex-column min-w-0">
                    <span className="search-username">{userSearched.username}</span>
                    <span className="search-name text-secondary">{userSearched.nome}</span>
                    {emComum > 0 && (
                        <small className="text-secondary text-truncate">
                            Seguido por {emComum} {emComum === 1 ? 'usuário' : 'usuários'} em comum
                        </small>
                    )}
                </div>
            </Link>
        </li>
    )
}

export default CardUsuarioSearch
