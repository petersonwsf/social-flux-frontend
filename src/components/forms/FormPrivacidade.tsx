import { useState } from 'react'
import { useConta } from '../../hooks/useConta'
import type { Usuario } from '../../types/api'

/** Opção "Conta privada" com botão de salvar (check; spinner girando enquanto a requisição é processada). */
function FormPrivacidade({ user }: { user: Usuario }) {
    const { alterarPrivacidade } = useConta()
    const [privado, setPrivado] = useState(user.privado)
    const [salvando, setSalvando] = useState(false)

    const salvar = async () => {
        setSalvando(true)
        try {
            await alterarPrivacidade(privado)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div>
            <div className="form-check form-switch mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="contaPrivada"
                    checked={privado}
                    disabled={salvando}
                    onChange={(event) => setPrivado(event.target.checked)}
                />
                <label htmlFor="contaPrivada" className="form-check-label">
                    Conta privada
                </label>
            </div>
            <p className="text-secondary small">
                Com a conta privada, só quem você aprova pode seguir você e ver suas postagens.
            </p>
            <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                disabled={salvando || privado === user.privado}
                onClick={() => void salvar()}
            >
                {salvando ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                    <ion-icon name="checkmark-outline"></ion-icon>
                )}
                Salvar modificações
            </button>
        </div>
    )
}

export default FormPrivacidade
