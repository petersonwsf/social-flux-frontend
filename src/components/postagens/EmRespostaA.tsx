import { Link } from 'react-router-dom'
import type { PaiPostagem } from '../../types/api'

interface EmRespostaAProps {
    pai: PaiPostagem
    /** Com link para o perfil do autor do pai (fora de outro link). */
    comLink?: boolean
}

/** "Em resposta a @fulano" — ou "a uma publicação" quando o usuário não pode ver o pai (o servidor omite o autor). */
function EmRespostaA({ pai, comLink = false }: EmRespostaAProps) {
    if (!pai.autor_username) {
        return <p className="text-secondary referente">Em resposta a uma publicação</p>
    }
    return (
        <p className="text-secondary referente">
            Em resposta a{' '}
            {comLink ? (
                <Link to={`/perfil/${pai.autor_username}`} className="text-decoration-none">
                    @{pai.autor_username}
                </Link>
            ) : (
                <span className="text-primary">@{pai.autor_username}</span>
            )}
        </p>
    )
}

export default EmRespostaA
