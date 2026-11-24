import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPostImageUrl } from '../../lib/imageUrl'
import type { ImagemPostagem } from '../../types/api'

interface CarrosselImagensProps {
    imagens: ImagemPostagem[]
    /** Posição da imagem mostrada. */
    indice: number
    onMudar: (indice: number) => void
    onFechar: () => void
}

/**
 * Carrossel com as imagens completas (sem corte) de uma postagem: painel centralizado sobre um fundo escuro, com setas
 * ao lado da imagem e pontos embaixo. Fecha com Esc, no X ou clicando no fundo; as setas do teclado também trocam de imagem.
 */
function CarrosselImagens({ imagens, indice, onMudar, onFechar }: CarrosselImagensProps) {
    const total = imagens.length
    const atual = imagens[indice]

    useEffect(() => {
        const aoTeclar = (evento: KeyboardEvent) => {
            if (evento.key === 'Escape') onFechar()
            else if (evento.key === 'ArrowLeft' && indice > 0) onMudar(indice - 1)
            else if (evento.key === 'ArrowRight' && indice < total - 1) onMudar(indice + 1)
        }
        document.addEventListener('keydown', aoTeclar)
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.body.style.overflow = overflow
        }
    }, [indice, total, onMudar, onFechar])

    if (!atual) return null

    return createPortal(
        <div
            className="carrossel"
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ${indice + 1} de ${total}`}
            onClick={onFechar}
        >
            <div className="carrossel-painel" onClick={(evento) => evento.stopPropagation()}>
                <button type="button" className="carrossel-fechar" aria-label="Fechar" onClick={onFechar}>
                    <ion-icon name="close-outline"></ion-icon>
                </button>
                <div className="carrossel-palco">
                    <button
                        type="button"
                        className="carrossel-seta"
                        aria-label="Imagem anterior"
                        disabled={indice === 0}
                        onClick={() => onMudar(indice - 1)}
                    >
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </button>
                    <img
                        key={atual.url}
                        src={getPostImageUrl(atual.url)}
                        alt={`Imagem ${indice + 1} de ${total}`}
                        className="carrossel-imagem"
                    />
                    <button
                        type="button"
                        className="carrossel-seta"
                        aria-label="Próxima imagem"
                        disabled={indice === total - 1}
                        onClick={() => onMudar(indice + 1)}
                    >
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </button>
                </div>
                {total > 1 && (
                    <div className="carrossel-pontos" role="tablist" aria-label="Imagens da postagem">
                        {imagens.map((imagem, posicao) => (
                            <button
                                key={imagem.url}
                                type="button"
                                role="tab"
                                aria-selected={posicao === indice}
                                aria-label={`Ir para a imagem ${posicao + 1}`}
                                className={`carrossel-ponto ${posicao === indice ? 'ativo' : ''}`.trim()}
                                onClick={() => onMudar(posicao)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    )
}

export default CarrosselImagens
