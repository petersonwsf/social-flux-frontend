import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import AuthShell from '../../components/auth/AuthShell'
import { FormField } from '../../components/forms/FormField'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/errors'
import * as authService from '../../services/authService'

interface ResetValues {
    novaSenha: string
    confirmarSenha: string
}

const validationSchema = Yup.object({
    novaSenha: Yup.string().required('Campo obrigatório').min(8, 'A senha deve conter no mínimo 8 caracteres'),
    confirmarSenha: Yup.string()
        .required('Campo obrigatório')
        .oneOf([Yup.ref('novaSenha')], 'As senhas não coincidem'),
})

function ResetPassword() {
    const toast = useToast()
    const [params] = useSearchParams()
    const token = params.get('token') ?? ''
    const [concluido, setConcluido] = useState(false)
    const initialValues: ResetValues = { novaSenha: '', confirmarSenha: '' }

    if (!token) {
        return (
            <AuthShell title="Link inválido">
                <p className="text-center">O link de redefinição está incompleto. Peça um novo.</p>
                <div className="text-center mt-4">
                    <Link to="/forgot-password" className="btn btn-primary">
                        Pedir novo link
                    </Link>
                </div>
            </AuthShell>
        )
    }

    if (concluido) {
        return (
            <AuthShell title="Senha redefinida">
                <p className="text-center">Tudo certo! Entre com a sua nova senha.</p>
                <div className="text-center mt-4">
                    <Link to="/login" className="btn btn-primary">
                        Ir para o login
                    </Link>
                </div>
            </AuthShell>
        )
    }

    return (
        <AuthShell title="Nova senha">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async ({ novaSenha }) => {
                    try {
                        await authService.resetPassword(token, novaSenha)
                        setConcluido(true)
                    } catch (error) {
                        toast.error(getErrorMessage(error))
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <FormField name="novaSenha" label="Nova senha" type="password" />
                        <FormField name="confirmarSenha" label="Confirme a nova senha" type="password" />
                        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                            Redefinir senha
                        </button>
                    </Form>
                )}
            </Formik>
        </AuthShell>
    )
}

export default ResetPassword
