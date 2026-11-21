import { useCurrentUser } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { calcTempPost } from '../../lib/dates'
import { ehDoUsuario } from '../../lib/autoria'
import { usePostagemInteracoes } from '../../hooks/usePostagemInteracoes'
import Avatar from '../common/Avatar'
import FormComentar from '../forms/FormComentar'
import DropdownActions from './DropdownActions'
import EmRespostaA from './EmRespostaA'
import ImagemPostagem from './ImagemPostagem'
import { CommentButton, LikeButton } from './PostActions'
import type { Postagem } from '../../types/api'

interface PostSecondaryProps {
    postagem: Postagem
    onExcluir: (id: string) => void
}

/** Card compacto de postagem, usado em listas e na cadeia de pais da página de detalhe. */
function PostSecondary({ postagem, onExcluir }: PostSecondaryProps) {
    const user = useCurrentUser()
    const { curtidas, respostas, comentando, alternarComentario, comentar } = usePostagemInteracoes(postagem)
    const autor = postagem.autor

    return (
        <>
            <article className="post-secondary" id={`post-${postagem.id}`}>
                <div className="d-flex ps-2 ps-lg-4 pt-2 pb-1">
                    <Link to={`/perfil/${autor.username}`} className="flex-shrink-0">
                        <Avatar user={autor} className="foto-perfil-postagem" />
                    </Link>
                    <div className="d-flex flex-column w-100 ps-2 min-w-0">
                        <div className="d-flex infos-user justify-content-between w-100 align-items-center">
                            <div className="d-flex text-truncate align-items-center">
                                <Link to={`/perfil/${autor.username}`} className="me-2 text-decoration-none d-flex text-truncate">
                                    {autor.nome}
                                    <span className="ms-2 text-truncate username-muted">@{autor.username}</span>
                                </Link>
                                <span className="text-secondary">{calcTempPost(postagem.criado_em)}</span>
                            </div>
                            {ehDoUsuario(autor, user) && <DropdownActions onExcluir={() => onExcluir(postagem.id)} />}
                        </div>
                        <Link className="text-decoration-none text-body mt-1" to={`/postagem/${postagem.id}`}>
                            {postagem.pai && <EmRespostaA pai={postagem.pai} />}
                            {postagem.legenda && <p className="legenda text-break pe-2">{postagem.legenda}</p>}
                            {postagem.imagem && <ImagemPostagem imagem={postagem.imagem} />}
                        </Link>
                        <div className="actions mt-1 d-flex align-items-center">
                            <LikeButton curtido={curtidas.curtido} onToggle={() => void curtidas.alternar()} />
                            <span className="me-3">{curtidas.total}</span>
                            <CommentButton onClick={alternarComentario} />
                            <span>{respostas.total}</span>
                        </div>
                        {comentando && (
                            <div className="w-100 mt-4 pe-2">
                                <FormComentar user={user} idPostagem={postagem.id} onSubmit={comentar} />
                            </div>
                        )}
                    </div>
                </div>
            </article>
            <hr />
        </>
    )
}

export default PostSecondary
