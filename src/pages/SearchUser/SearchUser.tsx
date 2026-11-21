import ButtonBack from '../../components/common/ButtonBack'
import ResultadosPesquisa from '../../components/usuarios/ResultadosPesquisa'
import { usePesquisaUsuarios } from '../../hooks/usePesquisaUsuarios'

function SearchUser() {
    const { busca, setBusca, resultados } = usePesquisaUsuarios()

    return (
        <div className="search-user">
            <div className="me-2 d-flex align-items-center">
                <ButtonBack />
                <input
                    type="search"
                    className="form-control"
                    placeholder="Faça sua pesquisa"
                    aria-label="Pesquisar usuários"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                />
            </div>
            <hr />
            <div className="mx-2 text-break">
                <ResultadosPesquisa busca={busca} resultados={resultados} />
            </div>
        </div>
    )
}

export default SearchUser
