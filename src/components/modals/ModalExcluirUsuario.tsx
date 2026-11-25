import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FormField } from '../forms/FormField'
import { useConta } from '../../hooks/useConta'

interface ExcluirContaValues {
    senha: string
    confirmarSenha: string
}

const validationSchema = Yup.object({
    senha: Yup.string().required('Campo obrigatório').min(8, 'A senha deve conter no mínimo 8 caracteres'),
    confirmarSenha: Yup.string()
        .required('Campo obrigatório')
        .oneOf([Yup.ref('senha')], 'As senhas não coincidem'),
})

function ModalExcluirUsuario({ id }: { id: string }) {
    const { excluirConta } = useConta()
    const initialValues: ExcluirContaValues = { senha: '', confirmarSenha: '' }

    return (
        <div className="modal fade" id={id} data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content modal-acao">
                    <div className="modal-body text-center">
                        <div className="modal-acao-icone perigo">
                            <ion-icon name="trash-outline"></ion-icon>
                        </div>
                        <h2 className="modal-acao-titulo">Excluir sua conta?</h2>
                        <p className="modal-acao-descricao">
                            Seu perfil, suas postagens e suas relações serão apagados e isso não pode ser desfeito. Digite sua senha
                            para confirmar.
                        </p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={({ senha }) => excluirConta(senha)}
                        >
                            {({ isValid, dirty, isSubmitting, resetForm }) => (
                                <Form noValidate className="text-start">
                                    <FormField name="senha" label="Senha" type="password" />
                                    <FormField name="confirmarSenha" label="Confirmar senha" type="password" />
                                    <div className="modal-acao-botoes mt-3">
                                        <button
                                            type="button"
                                            className="btn modal-acao-cancelar"
                                            data-bs-dismiss="modal"
                                            onClick={() => resetForm()}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="btn modal-acao-perigo d-flex align-items-center justify-content-center"
                                            disabled={!(isValid && dirty) || isSubmitting}
                                            type="submit"
                                        >
                                            {isSubmitting && (
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            )}
                                            Excluir conta
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalExcluirUsuario
