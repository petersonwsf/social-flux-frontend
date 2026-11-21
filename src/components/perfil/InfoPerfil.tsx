import Avatar from '../common/Avatar'
import RelacoesEmComum from '../relacoes/RelacoesEmComum'
import ActionsProfile from './ActionsProfile'
import NumeroRelacoes from './NumeroRelacoes'
import type { EstadoRelacao, Usuario } from '../../types/api'

interface InfoPerfilProps {
    perfil: Usuario
    user: Usuario
    numeroSeguidores: number
    numeroSeguidos: number
    estado: EstadoRelacao
    onSeguir: () => void
    onCancelarSolicitacao: () => void
}

export const MODAL_SEGUIDORES = 'seguidores'
export const MODAL_SEGUIDOS = 'seguidos'
export const MODAL_DEIXAR_DE_SEGUIR = 'modalDeixarDeSeguir'

function InfoPerfil({
    perfil,
    user,
    numeroSeguidores,
    numeroSeguidos,
    estado,
    onSeguir,
    onCancelarSolicitacao,
}: InfoPerfilProps) {
    const ehProprioPerfil = perfil.id === user.id

    return (
        <div className="row g-0 px-2 px-lg-5 py-3">
            <div className="col-3 d-flex justify-content-center align-items-start">
                <Avatar user={perfil} className="foto-perfil" />
            </div>
            <div className="col-9 d-flex flex-column ps-2 ps-lg-4">
                <div className="d-flex justify-content-between w-100 flex-wrap">
                    <div className="d-flex flex-column">
                        <p className="perfil-username mb-0">{perfil.username}</p>
                        <p className="perfil-nome text-secondary">{perfil.nome}</p>
                    </div>
                    <div className="d-flex">
                        <NumeroRelacoes numero={numeroSeguidores} label="Seguidores" modalId={MODAL_SEGUIDORES} />
                        <NumeroRelacoes numero={numeroSeguidos} label="Seguidos" modalId={MODAL_SEGUIDOS} />
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
