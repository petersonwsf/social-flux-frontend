import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import AuthShell from '../../components/auth/AuthShell'
import { FormField } from '../../components/forms/FormField'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/errors'
import * as authService from '../../services/authService'

const validationSchema = Yup.object({
    email: Yup.string().required('Preencha o campo de email').email('Endereço de email inválido'),
})

function ForgotPassword() {
    const toast = useToast()
    const [enviado, setEnviado] = useState(false)

    if (enviado) {
        return (
            <AuthShell title="Verifique seu e-mail">
                <p className="text-center">
                    Se o e-mail estiver cadastrado, enviamos as instruções para redefinir a senha. O link vale por 1 hora.
                </p>
                <div className="text-center mt-4">
                    <Link to="/login" className="btn btn-primary">
                        Voltar ao login
                    </Link>
                </div>
            </AuthShell>
        )
    }

    return (
        <AuthShell title="Esqueci minha senha">
            <p className="text-center text-secondary">Informe o e-mail da sua conta para receber o link de redefinição.</p>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={async ({ email }) => {
                    try {
                        await authService.forgotPassword(email)
                        setEnviado(true)
                    } catch (error) {
                        toast.error(getErrorMessage(error))
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <FormField name="email" label="Email" type="email" />
                        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                            Enviar link
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="text-center mt-3">
                <Link to="/login" className="btn btn-link">
                    Voltar ao login
                </Link>
            </div>
        </AuthShell>
    )
}

export default ForgotPassword
