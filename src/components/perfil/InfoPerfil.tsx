import Avatar from '../common/Avatar'
import ModalFotoPerfil from '../modals/ModalFotoPerfil'
import RelacoesEmComum from '../relacoes/RelacoesEmComum'
import ActionsProfile from './ActionsProfile'
import NumeroRelacoes from './NumeroRelacoes'
import type { EstadoRelacao, Usuario } from '../../types/api'

interface InfoPerfilProps {
    perfil: Usuario
    user: Usuario
    numeroSeguidores: number
    numeroSeguidos: number
    /** Contagens ainda a caminho: os números aparecem como placeholder pulsante. */
    carregandoContagens?: boolean
    estado: EstadoRelacao
    onSeguir: () => void
    onCancelarSolicitacao: () => void
}

export const MODAL_SEGUIDORES = 'seguidores'
export const MODAL_SEGUIDOS = 'seguidos'
export const MODAL_DEIXAR_DE_SEGUIR = 'modalDeixarDeSeguir'
const MODAL_FOTO_PERFIL = 'modalFotoPerfil'

function InfoPerfil({
    perfil,
    user,
    numeroSeguidores,
    numeroSeguidos,
    carregandoContagens = false,
    estado,
    onSeguir,
    onCancelarSolicitacao,
}: InfoPerfilProps) {
    const ehProprioPerfil = perfil.id === user.id

    return (
        <div className="row g-0 px-2 px-lg-5 py-3">
            <div className="col-3 d-flex justify-content-center align-items-start">
                <button
                    type="button"
                    className="btn p-0 border-0 w-100 foto-perfil-botao"
                    data-bs-toggle="modal"
                    data-bs-target={`#${MODAL_FOTO_PERFIL}`}
                    aria-label="Ampliar foto de perfil"
                >
                    <Avatar user={perfil} className="foto-perfil" />
                </button>
                <ModalFotoPerfil id={MODAL_FOTO_PERFIL} user={perfil} />
            </div>
            <div className="col-9 d-flex flex-column ps-2 ps-lg-4">
                <div className="d-flex justify-content-between align-items-start w-100 gap-1">
                    <div className="d-flex flex-column min-w-0">
                        <p className="perfil-username text-truncate mb-0">{perfil.username}</p>
                        <p className="perfil-nome text-secondary text-truncate">{perfil.nome}</p>
                    </div>
                    <div className="d-flex flex-shrink-0">
                        <NumeroRelacoes
                            numero={numeroSeguidores}
                            label="Seguidores"
                            modalId={MODAL_SEGUIDORES}
                            carregando={carregandoContagens}
                        />
                        <NumeroRelacoes
                            numero={numeroSeguidos}
                            label="Seguidos"
                            modalId={MODAL_SEGUIDOS}
                            carregando={carregandoContagens}
                        />
                    </div>
                </div>
                {perfil.biografia && <p className="perfil-bio mt-1">{perfil.biografia}</p>}
                {!ehProprioPerfil && <RelacoesEmComum user={user} perfil={perfil} />}
            </div>
            <div className="d-flex justify-content-end mt-2">
                <ActionsProfile
                    ehProprioPerfil={ehProprioPerfil}
                    estado={estado}
                    onSeguir={onSeguir}
                    onCancelarSolicitacao={onCancelarSolicitacao}
                    modalDeixarDeSeguirId={MODAL_DEIXAR_DE_SEGUIR}
                />
            </div>
        </div>
    )
}

export default InfoPerfil
