import ListarPostagens from '../../components/postagens/ListarPostagens'
import NoContent from '../../components/common/NoContent'
import { usePostagensUsuario } from '../../hooks/usePostagens'
import type { FiltroPostagensUsuario } from '../../services/postagemService'
import type { Usuario } from '../../types/api'

const MENSAGEM_VAZIA: Record<FiltroPostagensUsuario, string> = {
    posts: 'Não há publicações',
    interacoes: 'Não há publicações',
    midia: 'Este usuário não postou nenhuma mídia',
}

interface PerfilPostagensProps {
    perfil: Usuario
    filtro: FiltroPostagensUsuario
}

/** Lista paginada das postagens do perfil conforme a aba selecionada (posts, interações ou mídia). */
function PerfilPostagens({ perfil, filtro }: PerfilPostagensProps) {
    const { postagens, setPostagens, carregando, temMais, carregandoMais, carregarMais } = usePostagensUsuario(
        perfil.id,
        filtro,
    )

    if (carregando) return null

    return postagens.length > 0 ? (
        <ListarPostagens
            postagens={postagens}
            setPostagens={setPostagens}
            temMais={temMais}
            carregandoMais={carregandoMais}
            onCarregarMais={carregarMais}
        />
    ) : (
        <NoContent msg={MENSAGEM_VAZIA[filtro]} />
    )
}

export default PerfilPostagens
