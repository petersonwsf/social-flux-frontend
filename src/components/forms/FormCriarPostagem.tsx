import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FileField, FormField } from './FormField'
import { MAX_LEGENDA, TIPOS_ACEITOS, temConteudo, validarAnexo } from '../../lib/midia'
import type { CriarPostagemPayload } from '../../types/api'

const validationSchema = Yup.object({
    legenda: Yup.string().defined().max(MAX_LEGENDA, `O texto pode ter no máximo ${MAX_LEGENDA} caracteres`),
    imagem: Yup.mixed<File>()
        .nullable()
        .defined()
        .test('anexo', (value, context) => {
            const erro = validarAnexo(value ?? null)
            return erro ? context.createError({ message: erro }) : true
        })
        .test('conteudo', 'Escreva um texto ou anexe uma imagem', (value, context) => {
            const { legenda } = context.parent as { legenda?: unknown }
            return temConteudo(typeof legenda === 'string' ? legenda : '', value ?? null)
        }),
})

interface FormCriarPostagemProps {
    onSubmit: (values: CriarPostagemPayload) => Promise<void>
}

/** Nova postagem: texto e/ou uma imagem (PNG, JPEG, WebP) ou GIF. */
function FormCriarPostagem({ onSubmit }: FormCriarPostagemProps) {
    const initialValues: CriarPostagemPayload = { legenda: '', imagem: null }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
                <Form noValidate>
                    <FileField name="imagem" label="Imagem ou GIF (opcional)" accept={TIPOS_ACEITOS} />
                    <FormField name="legenda" label="Legenda" as="textarea" height={150} />
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                        Postar
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default FormCriarPostagem
