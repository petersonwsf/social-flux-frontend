import { useCurrentUser } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/dates'
import { ehDoUsuario } from '../../lib/autoria'
import { usePostagemInteracoes } from '../../hooks/usePostagemInteracoes'
import Avatar from '../common/Avatar'
import FormComentar from '../forms/FormComentar'
import DropdownActions from './DropdownActions'
import EmRespostaA from './EmRespostaA'
import ImagemPostagem from './ImagemPostagem'
import { CommentButton, LikeButton } from './PostActions'
import type { Postagem as PostagemModel } from '../../types/api'

interface PostagemProps {
    postagem: PostagemModel
    onExcluir: (id: string) => void
    /** Chamado quando uma resposta é criada (ex.: para recarregar a lista de respostas). */
    onResposta?: () => void
}

/** Card completo de uma postagem (página de detalhe). A cadeia de pais é mostrada pela página, acima do card. */
function Postagem({ postagem, onExcluir, onResposta }: PostagemProps) {
    const user = useCurrentUser()
    const { curtidas, respostas, comentando, alternarComentario, comentar } = usePostagemInteracoes(postagem, onResposta)
    const autor = postagem.autor

    return (
        <article className="post my-3" id={`post-${postagem.id}`}>
            <div className="d-flex px-3">
                <Link to={`/perfil/${autor.username}`} className="flex-shrink-0">
                    <Avatar user={autor} className="foto-perfil" />
                </Link>
                <div className="w-100 ps-3 d-flex flex-column min-w-0">
                    <div className="d-flex infos-user mb-1 justify-content-between">
                        <Link
                            className="d-flex text-decoration-none align-items-center w-75 text-truncate"
                            to={`/perfil/${autor.username}`}
                        >
                            {autor.nome}
                            <span className="mx-2 text-truncate username-muted">@{autor.username}</span>
                        </Link>
                        {ehDoUsuario(autor, user) && <DropdownActions onExcluir={() => onExcluir(postagem.id)} />}
                    </div>
                    {postagem.pai && <EmRespostaA pai={postagem.pai} comLink />}
                    {postagem.legenda && <p className="legenda text-break">{postagem.legenda}</p>}
                    {postagem.imagem && <ImagemPostagem imagem={postagem.imagem} className="mt-2" />}
                    <p className="text-secondary data-publicacao mt-2">{formatDate(postagem.criado_em)}</p>
                    <div className="infos-post d-flex">
                        <span className="me-3">{curtidas.total} Curtidas</span>
                        <span>{respostas.total} Comentários</span>
                    </div>
                </div>
            </div>
            <hr />
            <div className="actions d-flex px-4">
                <LikeButton curtido={curtidas.curtido} onToggle={() => void curtidas.alternar()} />
                <CommentButton onClick={alternarComentario} />
            </div>
            {comentando && (
                <div className="px-3 my-3">
                    <FormComentar user={user} idPostagem={postagem.id} onSubmit={comentar} />
                </div>
            )}
            <hr />
        </article>
    )
}

export default Postagem
