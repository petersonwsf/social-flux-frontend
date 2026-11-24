import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FileField, FormField } from './FormField'
import { MAX_IMAGENS, MAX_LEGENDA, TIPOS_ACEITOS, temConteudo, validarAnexos } from '../../lib/midia'
import type { CriarPostagemPayload } from '../../types/api'

const validationSchema = Yup.object({
    legenda: Yup.string().defined().max(MAX_LEGENDA, `O texto pode ter no máximo ${MAX_LEGENDA} caracteres`),
    imagens: Yup.mixed<File[]>()
        .defined()
        .test('anexos', (value, context) => {
            const erro = validarAnexos(value ?? [])
            return erro ? context.createError({ message: erro }) : true
        })
        .test('conteudo', 'Escreva um texto ou anexe uma imagem', (value, context) => {
            const { legenda } = context.parent as { legenda?: unknown }
            return temConteudo(typeof legenda === 'string' ? legenda : '', value ?? [])
        }),
})

interface FormCriarPostagemProps {
    onSubmit: (values: CriarPostagemPayload) => Promise<void>
}

/** Nova postagem: texto e/ou até 5 imagens (PNG, JPEG, WebP) ou um GIF. */
function FormCriarPostagem({ onSubmit }: FormCriarPostagemProps) {
    const initialValues: CriarPostagemPayload = { legenda: '', imagens: [] }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
                <Form noValidate>
                    <FileField
                        name="imagens"
                        label={`Imagens (opcional, até ${MAX_IMAGENS}) ou um GIF`}
                        accept={TIPOS_ACEITOS}
                        multiple
                    />
                    <FormField name="legenda" label="Legenda" as="textarea" height={150} emoji />
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                        Postar
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default FormCriarPostagem
