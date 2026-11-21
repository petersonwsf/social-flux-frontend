import { getPostImageUrl } from '../../lib/imageUrl'
import type { ImagemPostagem as ImagemPostagemModel } from '../../types/api'

interface ImagemPostagemProps {
    imagem: ImagemPostagemModel
    className?: string
}

/**
 * Anexo de uma postagem (imagem ou GIF animado, com `<img>` normal). `width`/`height` vindos da API reservam o espaço
 * antes de carregar (sem "pulo" de layout); o CSS mantém a proporção. A URL é autenticada pelo cookie da sessão.
 */
function ImagemPostagem({ imagem, className = '' }: ImagemPostagemProps) {
    return (
        <img
            src={getPostImageUrl(imagem.url)}
            width={imagem.largura ?? undefined}
            height={imagem.altura ?? undefined}
            loading="lazy"
            decoding="async"
            className={`post-image ${className}`.trim()}
            alt={imagem.tipo === 'GIF' ? 'GIF da postagem' : 'Imagem da postagem'}
        />
    )
}

export default ImagemPostagem
