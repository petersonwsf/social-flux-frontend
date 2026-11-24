interface NumeroRelacoesProps {
    label: string
    numero: number
    /** Id do modal (sem #) aberto ao clicar. */
    modalId: string
    /** Mostra um placeholder pulsante no lugar do número enquanto a contagem não chega. */
    carregando?: boolean
}

function NumeroRelacoes({ label, numero, modalId, carregando = false }: NumeroRelacoesProps) {
    return (
        <button
            type="button"
            className="btn follow text-center mx-0 mx-sm-2 mx-lg-4"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
        >
            {carregando ? (
                <span className="d-block placeholder-glow" aria-busy="true" aria-label="Carregando">
                    <span className="placeholder rounded numero-relacoes-placeholder"></span>
                </span>
            ) : (
                <span className="d-block numero-relacoes-valor fw-semibold mb-0">{numero}</span>
            )}
            <span className="d-block numero-relacoes-label">{label}</span>
        </button>
    )
}

export default NumeroRelacoes
