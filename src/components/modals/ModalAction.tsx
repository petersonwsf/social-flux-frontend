interface ModalActionProps {
    id: string
    /** Pergunta curta (ex.: "Excluir postagem?"). */
    title: string
    /** Texto de apoio abaixo do título (consequência da ação). */
    descricao?: string
    /** Nome do ícone (ionicons, registrado em `lib/icons.ts`) mostrado no círculo do topo. */
    icone?: string
    /** Texto do botão de confirmação. */
    titleAction: string
    action: () => void
    /** Ação destrutiva: ícone e botão de confirmação em vermelho (senão, na cor principal do tema). */
    danger?: boolean
}

/**
 * Modal de confirmação (Bootstrap): ícone em círculo, título, texto de apoio e dois botões lado a lado
 * (Cancelar e confirmar). Fecha ao confirmar ou cancelar.
 */
function ModalAction({ id, title, descricao, icone = 'help-circle-outline', titleAction, action, danger = false }: ModalActionProps) {
    return (
        <div className="modal fade" id={id} data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content modal-acao">
                    <div className="modal-body text-center">
                        <div className={`modal-acao-icone ${danger ? 'perigo' : ''}`.trim()}>
                            <ion-icon name={icone}></ion-icon>
                        </div>
                        <h2 className="modal-acao-titulo">{title}</h2>
                        {descricao && <p className="modal-acao-descricao">{descricao}</p>}
                        <div className="modal-acao-botoes">
                            <button type="button" className="btn modal-acao-cancelar" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={`btn ${danger ? 'modal-acao-perigo' : 'modal-acao-confirmar'}`}
                                onClick={action}
                                data-bs-dismiss="modal"
                            >
                                {titleAction}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAction
