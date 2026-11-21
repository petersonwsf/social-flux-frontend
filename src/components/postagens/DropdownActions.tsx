interface DropdownActionsProps {
    onExcluir: () => void
}

function DropdownActions({ onExcluir }: DropdownActionsProps) {
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
                    <button type="button" className="dropdown-item d-flex align-items-center text-danger" onClick={onExcluir}>
                        <ion-icon name="trash-outline"></ion-icon> Excluir postagem
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default DropdownActions
