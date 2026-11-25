import { useState } from 'react'
import { useConta } from '../../hooks/useConta'
import ModalAction from '../modals/ModalAction'
import type { Usuario } from '../../types/api'

const MODAL_PRIVACIDADE = 'modalPrivacidade'

/**
 * Opção "Conta privada". Mexer no interruptor abre um modal de confirmação; a alteração só é salva ao confirmar
 * (o interruptor continua no valor atual até lá e fica desabilitado, com um spinner, enquanto a requisição é processada).
 */
function FormPrivacidade({ user }: { user: Usuario }) {
    const { alterarPrivacidade } = useConta()
    const [salvando, setSalvando] = useState(false)
    const novoValor = !user.privado

    const confirmar = async () => {
        setSalvando(true)
        try {
            await alterarPrivacidade(novoValor)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div>
            <div className="form-check form-switch mb-2 d-flex align-items-center">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="contaPrivada"
                    checked={user.privado}
                    disabled={salvando}
                    readOnly
                    data-bs-toggle="modal"
                    data-bs-target={`#${MODAL_PRIVACIDADE}`}
                />
                <label htmlFor="contaPrivada" className="form-check-label ms-2">
                    Conta privada
                </label>
                {salvando && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-label="Salvando"></span>
                )}
            </div>
            <p className="text-secondary small">
                Com a conta privada, só quem você aprova pode seguir você e ver suas postagens.
            </p>
            <ModalAction
                id={MODAL_PRIVACIDADE}
                title={novoValor ? 'Tornar sua conta privada?' : 'Tornar sua conta pública?'}
                descricao={
                    novoValor
                        ? 'Só quem você aprovar poderá seguir você e ver suas postagens. Quem já segue continua seguindo.'
                        : 'Qualquer pessoa poderá seguir você e ver suas postagens. Solicitações pendentes serão aceitas.'
                }
                icone={novoValor ? 'lock-closed-outline' : 'lock-open-outline'}
                titleAction={novoValor ? 'Tornar privada' : 'Tornar pública'}
                action={() => void confirmar()}
            />
        </div>
    )
}

export default FormPrivacidade
