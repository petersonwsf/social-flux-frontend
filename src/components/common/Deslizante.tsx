import { useState, type ReactNode } from 'react'

interface DeslizanteProps {
    aberto: boolean
    children: ReactNode
    /** Classes do contêiner externo (espaçamento). */
    className?: string
}

/**
 * Mostra/oculta o conteúdo com deslize vertical. O conteúdo continua montado até a animação de
 * fechamento terminar; depois de aberto e estável, o excesso deixa de ser cortado (dropdowns, sombras).
 */
function Deslizante({ aberto, children, className = '' }: DeslizanteProps) {
    const [montado, setMontado] = useState(aberto)
    const [estavel, setEstavel] = useState(false)

    if (aberto && !montado) setMontado(true)
    if (!aberto && estavel) setEstavel(false)
    if (!montado) return null

    const aoTerminar = () => {
        if (aberto) setEstavel(true)
        else setMontado(false)
    }

    return (
        <div
            className={`${aberto ? 'slide-down' : 'slide-up'} ${estavel ? 'estavel' : ''} ${className}`}
            onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) aoTerminar()
            }}
        >
            <div className="slide-inner">{children}</div>
        </div>
    )
}

export default Deslizante
