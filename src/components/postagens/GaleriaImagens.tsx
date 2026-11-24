import { useState } from 'react'
import { getPostImageUrl } from '../../lib/imageUrl'
import CarrosselImagens from './CarrosselImagens'
import type { ImagemPostagem } from '../../types/api'

interface GaleriaImagensProps {
    imagens: ImagemPostagem[]
    className?: string
}

function descricao(imagem: ImagemPostagem): string {
    return imagem.tipo === 'GIF' ? 'GIF da postagem' : 'Imagem da postagem'
}

/**
 * Anexos de uma postagem em grade (1 a 5 imagens). Uma imagem aparece inteira, na proporção original; duas ou mais ficam
 * em grade e podem ser cortadas para caber nos quadros. Clicar numa imagem abre o carrossel com todas, sem corte.
 * `width`/`height` da API reservam o espaço antes de carregar; a URL é autenticada pelo cookie da sessão.
 */
function GaleriaImagens({ imagens, className = '' }: GaleriaImagensProps) {
    const [aberta, setAberta] = useState<number | null>(null)
    const visiveis = imagens.slice(0, 5)
    if (visiveis.length === 0) return null

    const unica = visiveis.length === 1

    return (
        <>
            <div className={`galeria galeria-${visiveis.length} ${className}`.trim()}>
                {visiveis.map((imagem, indice) => (
                    <button
                        key={imagem.url}
                        type="button"
                        className="galeria-item"
                        aria-label={`Abrir imagem ${indice + 1} de ${visiveis.length}`}
                        onClick={() => setAberta(indice)}
                    >
                        <img
                            src={getPostImageUrl(imagem.url)}
                            width={unica ? (imagem.largura ?? undefined) : undefined}
                            height={unica ? (imagem.altura ?? undefined) : undefined}
                            loading="lazy"
                            decoding="async"
                            alt={descricao(imagem)}
                        />
                    </button>
                ))}
            </div>
            {aberta !== null && (
                <CarrosselImagens
                    imagens={visiveis}
                    indice={aberta}
                    onMudar={setAberta}
                    onFechar={() => setAberta(null)}
                />
            )}
        </>
    )
}

export default GaleriaImagens
