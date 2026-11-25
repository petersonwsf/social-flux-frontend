import { createPortal } from 'react-dom'
import ModalAction from '../modals/ModalAction'

interface DropdownActionsProps {
    /** Id da postagem: identifica o modal de confirmação de exclusão. */
    id: string
    onExcluir: () => void
}

/**
 * Menu "⋯" da postagem. "Excluir postagem" abre um modal de confirmação (renderizado no `body`, fora do card, para não
 * ser afetado pelo layout dele) e só exclui ao confirmar.
 */
function DropdownActions({ id, onExcluir }: DropdownActionsProps) {
    const idModal = `modalExcluirPostagem-${id}`

    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Mais ações"
            >
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-2">
                <li>
                    <button
                        type="button"
                        className="dropdown-item d-flex align-items-center text-danger"
                        data-bs-toggle="modal"
                        data-bs-target={`#${idModal}`}
                    >
                        <ion-icon name="trash-outline"></ion-icon> Excluir postagem
                    </button>
                </li>
            </ul>
            {createPortal(
                <ModalAction
                    id={idModal}
                    title="Excluir postagem?"
                    descricao="Essa ação não pode ser desfeita. A postagem e suas imagens serão removidas."
                    icone="trash-outline"
                    titleAction="Excluir"
                    action={onExcluir}
                    danger
                />,
                document.body,
            )}
        </div>
    )
}

export default DropdownActions
