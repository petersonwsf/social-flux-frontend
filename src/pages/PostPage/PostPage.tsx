import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ButtonBack from '../../components/common/ButtonBack'
import NotFoundMessage from '../../components/common/NotFoundMessage'
import ListarPostagens from '../../components/postagens/ListarPostagens'
import PostSecondary from '../../components/postagens/PostSecondary'
import Postagem from '../../components/postagens/Postagem'
import { useExcluirPostagem } from '../../hooks/usePostagemActions'
import { usePostagemDetalhe } from '../../hooks/usePostagemDetalhe'
import { useRespostas } from '../../hooks/usePostagens'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function PostPageView({ id }: { id: string }) {
    const navigate = useNavigate()
    const { postagem, ancestrais, setAncestrais, naoEncontrada, versaoRespostas, recarregarRespostas } =
        usePostagemDetalhe(id)
    const respostas = useRespostas(id, versaoRespostas)

    const aoExcluir = useCallback(() => navigate(-1), [navigate])
    const excluir = useExcluirPostagem(aoExcluir)
    const removerAncestral = useCallback(
        (idAncestral: string) => setAncestrais((lista) => lista.filter((item) => item.id !== idAncestral)),
        [setAncestrais],
    )
    const excluirAncestral = useExcluirPostagem(removerAncestral)

    return (
        <div className="post-page">
            <ButtonBack />
            {ancestrais.map((ancestral) => (
                <PostSecondary key={ancestral.id} postagem={ancestral} onExcluir={(postId) => void excluirAncestral(postId)} />
            ))}
            {postagem && (
                <Postagem postagem={postagem} onExcluir={(postId) => void excluir(postId)} onResposta={recarregarRespostas} />
            )}
            {naoEncontrada && <NotFoundMessage msg="Publicação não encontrada" />}
            {postagem && respostas.postagens.length > 0 && (
                <ListarPostagens
                    postagens={respostas.postagens}
                    setPostagens={respostas.setPostagens}
                    temMais={respostas.temMais}
                    carregandoMais={respostas.carregandoMais}
                    onCarregarMais={respostas.carregarMais}
                />
            )}
        </div>
    )
}

function PostPage() {
    const { id } = useParams()

    if (!id || !UUID.test(id)) return <NotFoundMessage msg="Publicação não encontrada" />

    return <PostPageView key={id} id={id} />
}

export default PostPage
