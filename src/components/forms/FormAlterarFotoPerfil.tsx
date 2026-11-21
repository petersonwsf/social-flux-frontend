import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FileField } from './FormField'

interface FotoPerfilValues {
    foto_perfil: File | null
}

const validationSchema = Yup.object({
    foto_perfil: Yup.mixed<File>().nullable().required('Arquivo é necessário'),
})

interface FormAlterarFotoPerfilProps {
    onSubmit: (foto: File) => Promise<void>
}

function FormAlterarFotoPerfil({ onSubmit }: FormAlterarFotoPerfilProps) {
    const initialValues: FotoPerfilValues = { foto_perfil: null }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async ({ foto_perfil }) => {
                if (foto_perfil) await onSubmit(foto_perfil)
            }}
        >
            {({ isSubmitting }) => (
                <Form noValidate>
                    <FileField name="foto_perfil" label="Nova foto" id="fotoPerfilInput" />
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={isSubmitting}>
                            Enviar
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default FormAlterarFotoPerfil
