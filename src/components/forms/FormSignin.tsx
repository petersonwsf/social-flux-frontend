import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { FormField } from './FormField'
import type { LoginPayload } from '../../types/api'

const validationSchema = Yup.object({
    email: Yup.string().required('Preencha o campo de email').email('Endereço de email inválido'),
    senha: Yup.string().required('Preencha o campo de senha').min(8, 'A senha deve conter no mínimo 8 caracteres'),
})

interface FormSigninProps {
    onSubmit: (values: LoginPayload) => Promise<void>
    toggleForm: () => void
}

function FormSignin({ onSubmit, toggleForm }: FormSigninProps) {
    const initialValues: LoginPayload = { email: '', senha: '' }

    return (
        <div className="auth-form">
            <h1 className="display-5 text-center mb-5">Login</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <FormField name="email" label="Email" type="email" />
                        <FormField name="senha" label="Senha" type="password" />
                        <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>
                            Entrar
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="mt-4 text-center">
                <button type="button" className="btn btn-link" onClick={toggleForm}>
                    Não tem conta? Cadastre-se
                </button>
                <Link to="/forgot-password" className="btn btn-link d-block mx-auto">
                    Esqueci minha senha
                </Link>
            </div>
        </div>
    )
}

export default FormSignin
