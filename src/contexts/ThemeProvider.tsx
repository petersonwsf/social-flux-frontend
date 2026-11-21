import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme, type ThemeContextValue } from './themeContext'

const STORAGE_KEY = 'sf-theme'
/** Chave usada pela versão anterior (redux-persist), lida uma vez para não perder a preferência. */
const LEGACY_KEY = 'persist:darkMode'

function readStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'dark' || stored === 'light') return stored

        const legacy = localStorage.getItem(LEGACY_KEY)
        if (legacy) {
            const parsed: unknown = JSON.parse(legacy)
            if (typeof parsed === 'object' && parsed !== null && (parsed as Record<string, unknown>).darkMode === 'true') {
                return 'dark'
            }
        }
    } catch {
        // localStorage indisponível ou valor corrompido: usa o tema claro.
    }
    return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(readStoredTheme)

    // O Bootstrap 5.3 troca de tema inteiro por este atributo.
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme)
        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // Sem persistência, a preferência vale apenas para esta sessão.
        }
    }, [theme])

    const toggleTheme = useCallback(() => setTheme((atual) => (atual === 'dark' ? 'light' : 'dark')), [])

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, darkMode: theme === 'dark', toggleTheme }),
        [theme, toggleTheme],
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
