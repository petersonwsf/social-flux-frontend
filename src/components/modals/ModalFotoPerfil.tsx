import Avatar from '../common/Avatar'
import type { Usuario } from '../../types/api'

interface ModalFotoPerfilProps {
    id: string
    user: Pick<Usuario, 'foto_perfil' | 'username'>
}

/** Foto de perfil ampliada no centro da tela, com o fundo embaçado. Fecha ao clicar fora, em Esc ou no botão. */
function ModalFotoPerfil({ id, user }: ModalFotoPerfilProps) {
    return (
        <div className="modal fade modal-foto-perfil" id={id} tabIndex={-1} aria-label={`Foto de perfil de ${user.username}`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered justify-content-center">
                <Avatar user={user} className="foto-perfil-ampliada shadow-lg" />
            </div>
        </div>
    )
}

export default ModalFotoPerfil
