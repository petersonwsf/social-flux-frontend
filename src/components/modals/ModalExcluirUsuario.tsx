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
                <div className="modal-content rounded-4">
                    <div className="modal-body d-flex flex-column p-4">
                        <p className="lead text-center">Insira sua senha para excluir sua conta</p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={({ senha }) => excluirConta(senha)}
                        >
                            {({ isValid, dirty, isSubmitting }) => (
                                <Form noValidate>
                                    <FormField name="senha" label="Senha" type="password" />
                                    <FormField name="confirmarSenha" label="Confirmar senha" type="password" />
                                    <div className="text-center">
                                        <button className="btn btn-danger" disabled={!(isValid && dirty) || isSubmitting} type="submit">
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
