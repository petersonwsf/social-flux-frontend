import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useExcluirPostagem } from '../../hooks/usePostagemActions'
import PostSecondary from './PostSecondary'
import type { Postagem } from '../../types/api'

interface ListarPostagensProps {
    postagens: Postagem[]
    setPostagens: Dispatch<SetStateAction<Postagem[]>>
    /** Há mais páginas no servidor (mostra "Carregar mais"). */
    temMais?: boolean
    carregandoMais?: boolean
    onCarregarMais?: () => void
}

/** Lista de `PostSecondary` paginada: remove da lista a postagem excluída e busca a página seguinte sob demanda. */
function ListarPostagens({ postagens, setPostagens, temMais = false, carregandoMais = false, onCarregarMais }: ListarPostagensProps) {
    const removerDaLista = useCallback(
        (id: string) => setPostagens((lista) => lista.filter((postagem) => postagem.id !== id)),
        [setPostagens],
    )
    const excluir = useExcluirPostagem(removerDaLista)

    return (
        <div>
            {postagens.map((postagem) => (
                <PostSecondary key={postagem.id} postagem={postagem} onExcluir={(id) => void excluir(id)} />
            ))}
            <div className="w-100 text-center pb-3">
                {temMais && onCarregarMais ? (
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={onCarregarMais}
                        disabled={carregandoMais}
                    >
                        {carregandoMais ? 'Carregando…' : 'Carregar mais'}
                    </button>
                ) : (
                    <p className="text-secondary">°</p>
                )}
            </div>
        </div>
    )
}

export default ListarPostagens
