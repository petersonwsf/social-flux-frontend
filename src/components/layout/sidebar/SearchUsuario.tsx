import { usePesquisaUsuarios } from '../../../hooks/usePesquisaUsuarios'
import ResultadosPesquisa from '../../usuarios/ResultadosPesquisa'
import SidebarBackLink from './SidebarBackLink'

function SearchUsuario({ onVoltar }: { onVoltar: () => void }) {
    const { busca, setBusca, resultados } = usePesquisaUsuarios()

    return (
        <div>
            <SidebarBackLink onClick={onVoltar} />
            <div className="mb-3 px-3">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar usuário"
                    aria-label="Buscar usuário"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                />
            </div>
            <div className="px-2">
                <ResultadosPesquisa busca={busca} resultados={resultados} />
            </div>
        </div>
    )
}

export default SearchUsuario
