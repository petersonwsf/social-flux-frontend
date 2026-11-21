import CardUsuarioSearch from './CardUsuarioSearch'
import type { Usuario } from '../../types/api'

interface ResultadosPesquisaProps {
    busca: string
    resultados: Usuario[]
}

/** Lista de usuários encontrados (ou a mensagem de nenhum resultado). */
function ResultadosPesquisa({ busca, resultados }: ResultadosPesquisaProps) {
    if (busca.trim().length > 0 && resultados.length === 0) {
        return (
            <p className="lead text-center text-break fs-6">
                Não foi encontrado nenhum usuário com &apos;{busca}&apos;
            </p>
        )
    }

    return (
        <ul className="nav nav-pills flex-column">
            {resultados.map((usuario) => (
                <CardUsuarioSearch key={usuario.id} userSearched={usuario} />
            ))}
        </ul>
    )
}

export default ResultadosPesquisa
