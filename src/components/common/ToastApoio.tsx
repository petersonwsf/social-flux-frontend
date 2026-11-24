interface ToastApoioProps {
    /** Mensagem de apoio vinda do backend (já com a orientação e o CVV 188). */
    mensagem: string
    onFechar: () => void
}

/**
 * Toast de apoio emocional, mostrado quando uma postagem é recusada por conter automutilação. Diferente do toast de erro,
 * fica mais tempo na tela e traz atalhos para ligar ao CVV (188, gratuito, 24 horas) e abrir o site.
 */
function ToastApoio({ mensagem, onFechar }: ToastApoioProps) {
    return (
        <div className="toast-apoio" role="alert">
            <button type="button" className="toast-apoio-fechar" aria-label="Fechar" onClick={onFechar}>
                <ion-icon name="close-outline"></ion-icon>
            </button>
            <p className="toast-apoio-titulo">
                <ion-icon name="heart-outline"></ion-icon> Você não está sozinho(a)
            </p>
            <p className="toast-apoio-texto">{mensagem}</p>
            <div className="toast-apoio-acoes">
                <a className="btn btn-primary btn-sm" href="tel:188">
                    Ligar para o 188
                </a>
                <a
                    className="btn btn-outline-primary btn-sm"
                    href="https://cvv.org.br"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Abrir cvv.org.br
                </a>
            </div>
        </div>
    )
}

export default ToastApoio
