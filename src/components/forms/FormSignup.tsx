import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { subYears } from 'date-fns'
import { FormField } from './FormField'
import type { RegisterPayload } from '../../types/api'

const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Campo obrigatório'),
    telefone: Yup.string()
        .required('Campo obrigatório')
        .min(11, 'Escreva o número de telefone no formato XX XXXXX-XXXX'),
    sexo: Yup.string().oneOf(['M', 'F']).required('Selecione uma opção'),
    data_nascimento: Yup.date()
        .typeError('Data inválida')
        .required('Campo obrigatório')
        .max(subYears(new Date(), 18), 'Você deve ter no mínimo 18 anos'),
    nome: Yup.string().required('Campo obrigatório'),
    username: Yup.string().required('Campo obrigatório'),
    senha: Yup.string().required('Campo obrigatório').min(8, 'A senha deve conter no mínimo 8 caracteres'),
    confirmarSenha: Yup.string()
        .required('Campo obrigatório')
        .oneOf([Yup.ref('senha')], 'As senhas não coincidem'),
})

const initialValues: RegisterPayload = {
    email: '',
    telefone: '',
    sexo: '',
    data_nascimento: '',
    nome: '',
    username: '',
    senha: '',
    confirmarSenha: '',
}

interface FormSignupProps {
    onSubmit: (values: RegisterPayload) => Promise<void>
    toggleForm: () => void
}

function FormSignup({ onSubmit, toggleForm }: FormSignupProps) {
    return (
        <div className="auth-form">
            <h1 className="display-5 text-center mb-5">Criar conta</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <p className="lead mb-3">Dados pessoais</p>
                        <FormField name="email" label="Email" type="email" />
                        <FormField name="telefone" label="Telefone" />
                        <div className="mb-3">
                            <p className="mb-1">Sexo</p>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field className="form-check-input" type="radio" name="sexo" value="F" />
                                    Feminino
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field className="form-check-input" type="radio" name="sexo" value="M" />
                                    Masculino
                                </label>
                            </div>
                            <ErrorMessage name="sexo" component="div" className="text-danger form-error" />
                        </div>
                        <FormField name="data_nascimento" label="Data de nascimento" type="date" />

                        <p className="lead mt-4 mb-3">Dados da conta</p>
                        <FormField name="nome" label="Nome" />
                        <FormField name="username" label="Username" />
                        <FormField name="senha" label="Senha" type="password" />
                        <FormField name="confirmarSenha" label="Confirme a senha" type="password" />

                        <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>
                            Criar conta
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="mt-4 text-center">
                <button type="button" className="btn btn-link" onClick={toggleForm}>
                    Já possui conta? Entrar
                </button>
            </div>
        </div>
    )
}

export default FormSignup
