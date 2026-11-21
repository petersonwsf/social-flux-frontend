import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FormField } from '../forms/FormField'
import { useConta } from '../../hooks/useConta'

interface AlterarSenhaValues {
    senhaAtual: string
    novaSenha: string
    confirmarSenha: string
}

const validationSchema = Yup.object({
    senhaAtual: Yup.string().required('Campo obrigatório'),
    novaSenha: Yup.string().required('Campo obrigatório').min(8, 'A senha deve conter no mínimo 8 caracteres'),
    confirmarSenha: Yup.string()
        .required('Campo obrigatório')
        .oneOf([Yup.ref('novaSenha')], 'As senhas não coincidem'),
})

function ModalAlterarSenha({ id }: { id: string }) {
    const { alterarSenha } = useConta()
    const initialValues: AlterarSenhaValues = { senhaAtual: '', novaSenha: '', confirmarSenha: '' }

    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content rounded-4">
                    <div className="modal-body d-flex flex-column p-4">
                        <p className="lead text-center">Alterar senha</p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async ({ senhaAtual, novaSenha }, { resetForm }) => {
                                if (await alterarSenha({ senhaAtual, novaSenha })) {
                                    resetForm()
                                    document.getElementById(`${id}-fechar`)?.click()
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form noValidate>
                                    <FormField name="senhaAtual" label="Senha atual" type="password" />
                                    <FormField name="novaSenha" label="Nova senha" type="password" />
                                    <FormField name="confirmarSenha" label="Confirme a nova senha" type="password" />
                                    <div className="d-flex justify-content-between">
                                        <button id={`${id}-fechar`} type="button" className="btn" data-bs-dismiss="modal">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            Salvar
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

export default ModalAlterarSenha
