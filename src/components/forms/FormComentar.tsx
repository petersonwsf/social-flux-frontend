import { ErrorMessage, Field, Form, Formik, type FormikErrors } from 'formik'
import Avatar from '../common/Avatar'
import ModalImagemComentario from '../modals/ModalImagemComentario'
import { MAX_LEGENDA, temConteudo, validarAnexo } from '../../lib/midia'
import type { CriarPostagemPayload, Usuario } from '../../types/api'

interface FormComentarProps {
    user: Usuario
    /** Usado para gerar um id de modal único por postagem. */
    idPostagem: string
    onSubmit: (values: CriarPostagemPayload) => Promise<void>
}

function validar(values: CriarPostagemPayload): FormikErrors<CriarPostagemPayload> {
    const erroAnexo = validarAnexo(values.imagem)
    if (erroAnexo) return { imagem: erroAnexo }
    if (values.legenda.length > MAX_LEGENDA) return { legenda: `O comentário pode ter no máximo ${MAX_LEGENDA} caracteres` }
    if (!temConteudo(values.legenda, values.imagem)) return { legenda: 'Escreva um comentário ou anexe uma imagem' }
    return {}
}

/** Resposta a uma postagem: texto e/ou imagem/GIF (escolhida num modal). */
function FormComentar({ user, idPostagem, onSubmit }: FormComentarProps) {
    const initialValues: CriarPostagemPayload = { legenda: '', imagem: null }
    const modalId = `modalImagemComentario-${idPostagem}`

    return (
        <Formik
            initialValues={initialValues}
            validate={validar}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (values, { resetForm }) => {
                await onSubmit(values)
                resetForm()
            }}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                    <div className="d-flex mb-2">
                        <Avatar user={user} size="30px" className="me-2 flex-shrink-0" />
                        <Field
                            as="textarea"
                            name="legenda"
                            className="input-comentario"
                            placeholder="Insira um comentário"
                            aria-label="Comentário"
                            style={{ height: '100px' }}
                        />
                    </div>
                    <ErrorMessage name="legenda" component="div" className="text-danger form-error mb-2" />
                    <ErrorMessage name="imagem" component="div" className="text-danger form-error mb-2" />
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <button
                            type="button"
                            className="btn btn-icon"
                            data-bs-toggle="modal"
                            data-bs-target={`#${modalId}`}
                            aria-label="Anexar imagem ou GIF"
                        >
                            <ion-icon name="image-outline"></ion-icon>
                            {values.imagem && <small className="ms-1">{values.imagem.name}</small>}
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            Comentar
                        </button>
                    </div>
                    <ModalImagemComentario
                        id={modalId}
                        onSelect={(file) => {
                            void setFieldValue('imagem', file)
                        }}
                    />
                </Form>
            )}
        </Formik>
    )
}

export default FormComentar
