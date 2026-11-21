function SidebarBackLink({ onClick }: { onClick: () => void }) {
    return (
        <div className="w-100 mb-3 px-2">
            <button type="button" onClick={onClick} className="nav-link d-flex align-items-center">
                <ion-icon name="chevron-back-outline"></ion-icon>Voltar
            </button>
        </div>
    )
}

export default SidebarBackLink
