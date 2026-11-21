interface NumeroRelacoesProps {
    label: string
    numero: number
    /** Id do modal (sem #) aberto ao clicar. */
    modalId: string
}

function NumeroRelacoes({ label, numero, modalId }: NumeroRelacoesProps) {
    return (
        <button
            type="button"
            className="btn follow text-center mx-2 mx-lg-4"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
        >
            <span className="d-block h4 mb-0">{numero}</span>
            <span className="d-block">{label}</span>
        </button>
    )
}

export default NumeroRelacoes
