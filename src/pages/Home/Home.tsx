import ListarPostagens from '../../components/postagens/ListarPostagens'
import NoContent from '../../components/common/NoContent'
import { useFeed } from '../../hooks/usePostagens'

function Home() {
    const { postagens, setPostagens, carregando, temMais, carregandoMais, carregarMais } = useFeed()

    if (carregando) return null

    return (
        <div className="home">
            {postagens.length > 0 ? (
                <ListarPostagens
                    postagens={postagens}
                    setPostagens={setPostagens}
                    temMais={temMais}
                    carregandoMais={carregandoMais}
                    onCarregarMais={carregarMais}
                />
            ) : (
                <div className="px-3">
                    <NoContent msg="Não há postagens para ver, siga mais usuários para ver suas postagens" />
                </div>
            )}
        </div>
    )
}

export default Home
