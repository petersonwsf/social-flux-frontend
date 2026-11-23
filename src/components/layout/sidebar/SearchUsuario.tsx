import { usePesquisaUsuarios } from '../../../hooks/usePesquisaUsuarios'
import Loading from '../../common/Loading'
import ResultadosPesquisa from '../../usuarios/ResultadosPesquisa'
import SidebarBackLink from './SidebarBackLink'

const DEBOUNCE_MS = 1000

function SearchUsuario({ onVoltar }: { onVoltar: () => void }) {
    const { busca, setBusca, resultados, carregando } = usePesquisaUsuarios(DEBOUNCE_MS)

    return (
        <div>
            <SidebarBackLink onClick={onVoltar} />
            <div className="mb-3 px-3">
                <div className="input-group">
                    <span className="input-group-text bg-transparent">
                        <ion-icon name="search-outline"></ion-icon>
                    </span>
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar usuário"
                        aria-label="Buscar usuário"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                    />
                </div>
            </div>
            <div className="px-2">
                {carregando ? (
                    <div className="d-flex justify-content-center">
                        <Loading width="48px" />
                    </div>
                ) : (
                    <ResultadosPesquisa busca={busca} resultados={resultados} />
                )}
            </div>
        </div>
    )
}

export default SearchUsuario
