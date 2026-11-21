interface ModalActionProps {
    id: string
    title: string
    titleAction: string
    action: () => void
    /** Destaca o botão de confirmação em vermelho. */
    danger?: boolean
}

/** Modal de confirmação (Bootstrap) com ação e cancelar. */
function ModalAction({ id, title, titleAction, action, danger = false }: ModalActionProps) {
    return (
        <div className="modal fade" id={id} data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content rounded-4">
                    <div className="modal-body d-flex flex-column p-4">
                        <p className="lead text-center">{title}</p>
                        <button type="button" className={`btn ${danger ? 'text-danger' : ''}`} onClick={action} data-bs-dismiss="modal">
                            {titleAction}
                        </button>
                        <button type="button" className="btn" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAction
