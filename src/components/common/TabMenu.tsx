interface TabMenuProps<T extends string> {
    tabs: ReadonlyArray<{ id: T; label: string }>
    active: T
    onChange: (id: T) => void
}

/** Menu de abas simples (usado no perfil e nas notificações). */
function TabMenu<T extends string>({ tabs, active, onChange }: TabMenuProps<T>) {
    return (
        <nav className="nav nav-underline nav-fill tab-menu" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={tab.id === active}
                    className={`nav-link ${tab.id === active ? 'active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    )
}

export default TabMenu
