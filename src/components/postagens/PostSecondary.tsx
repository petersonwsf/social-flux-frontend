import { useCurrentUser } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { calcTempPost } from '../../lib/dates'
import { ehDoUsuario } from '../../lib/autoria'
import { usePostagemInteracoes } from '../../hooks/usePostagemInteracoes'
import Avatar from '../common/Avatar'
import Deslizante from '../common/Deslizante'
import FormComentar from '../forms/FormComentar'
import DropdownActions from './DropdownActions'
import EmRespostaA from './EmRespostaA'
import GaleriaImagens from './GaleriaImagens'
import { CommentButton, LikeButton } from './PostActions'
import type { Postagem } from '../../types/api'

/** Partes do card que têm ação própria: clicar nelas não abre a postagem. */
const ELEMENTOS_COM_ACAO = 'a, button, input, textarea, form, label, .galeria, .carrossel, .dropdown-menu, .slide-down, .slide-up'

interface PostSecondaryProps {
    postagem: Postagem
    onExcluir: (id: string) => void
}

/**
 * Card compacto de postagem, usado em listas e na cadeia de pais da página de detalhe. Clicar em qualquer parte do card abre a
 * postagem, exceto nos elementos com ação própria (links, botões, imagens, formulário de comentário) ou ao selecionar texto.
 */
function PostSecondary({ postagem, onExcluir }: PostSecondaryProps) {
    const user = useCurrentUser()
    const { curtidas, respostas, comentando, alternarComentario, comentar } = usePostagemInteracoes(postagem)
    const autor = postagem.autor
    const navigate = useNavigate()

    const abrirPostagem = (evento: React.MouseEvent<HTMLElement>) => {
        if (!(evento.target instanceof Element) || evento.target.closest(ELEMENTOS_COM_ACAO)) return
        if (window.getSelection()?.toString()) return
        navigate(`/postagem/${postagem.id}`)
    }

    return (
        <>
            <article className="post-secondary" id={`post-${postagem.id}`} onClick={abrirPostagem}>
                <div className="d-flex ps-2 ps-lg-4 pt-2 pb-1">
                    <Link to={`/perfil/${autor.username}`} className="flex-shrink-0">
                        <Avatar user={autor} className="foto-perfil-postagem" />
                    </Link>
                    <div className="d-flex flex-column w-100 ps-2 min-w-0">
                        <div className="d-flex infos-user justify-content-between w-100 align-items-center">
                            <div className="d-flex text-truncate align-items-center">
                                <Link to={`/perfil/${autor.username}`} className="me-2 text-decoration-none d-flex text-truncate">
                                    <span className="nome-limitado">{autor.nome}</span>
                                    <span className="ms-2 text-truncate username-muted">@{autor.username}</span>
                                </Link>
                                <span className="text-secondary me-2" aria-hidden="true">·</span>
                                <span className="text-secondary">{calcTempPost(postagem.criado_em)}</span>
                            </div>
                            {ehDoUsuario(autor, user) && <DropdownActions onExcluir={() => onExcluir(postagem.id)} />}
                        </div>
                        {postagem.pai && <EmRespostaA pai={postagem.pai} comLink />}
                        <Link className="text-decoration-none text-body mt-1" to={`/postagem/${postagem.id}`}>
                            {postagem.legenda && <p className="legenda text-break pe-2">{postagem.legenda}</p>}
                        </Link>
                        {postagem.imagens.length > 0 && <GaleriaImagens imagens={postagem.imagens} className="mt-1" />}
                        <div className="actions mt-1 d-flex align-items-center">
                            <LikeButton curtido={curtidas.curtido} onToggle={() => void curtidas.alternar()} />
                            <span className="me-3">{curtidas.total}</span>
                            <CommentButton onClick={alternarComentario} />
                            <span>{respostas.total}</span>
                        </div>
                    </div>
                </div>
                <Deslizante aberto={comentando} className="px-2 px-lg-4 pb-2">
                    <FormComentar user={user} idPostagem={postagem.id} onSubmit={comentar} />
                </Deslizante>
            </article>
            <hr />
        </>
    )
}

export default PostSecondary
