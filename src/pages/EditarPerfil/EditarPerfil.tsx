import Avatar from '../../components/common/Avatar'
import ButtonBack from '../../components/common/ButtonBack'
import FormAlterarFotoPerfil from '../../components/forms/FormAlterarFotoPerfil'
import FormEditarPerfil from '../../components/forms/FormEditarPerfil'
import { useCurrentUser } from '../../hooks/useAuth'
import { useConta } from '../../hooks/useConta'

function EditarPerfil() {
    const user = useCurrentUser()
    const { editarPerfil, atualizarFotoPerfil } = useConta()

    return (
        <div className="editar-perfil">
            <ButtonBack />
            <div className="d-flex justify-content-center align-items-center flex-column">
                <Avatar user={user} className="my-2 foto-edicao" />
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalFotoDePerfil">
                    Trocar foto de perfil
                </button>
            </div>
            <hr />
            <div className="row g-0 px-3">
                <div className="col-12 col-xl-6 mb-3">
                    <FormEditarPerfil user={user} onSubmit={editarPerfil} />
                </div>
            </div>

            <div className="modal fade" id="modalFotoDePerfil" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p className="lead text-center">Escolher nova foto de perfil</p>
                            <FormAlterarFotoPerfil onSubmit={atualizarFotoPerfil} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditarPerfil
