import { useRef } from 'react'
import { ErrorMessage, Field, Form, Formik, type FormikErrors } from 'formik'
import Avatar from '../common/Avatar'
import ModalImagemComentario from '../modals/ModalImagemComentario'
import SeletorEmoji from './SeletorEmoji'
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
    const campoRef = useRef<HTMLTextAreaElement>(null)

    /** Insere o emoji na posição do cursor (ou no fim) e devolve o foco ao campo. */
    const inserirEmoji = (emoji: string, atual: string, atualizar: (texto: string) => void) => {
        const campo = campoRef.current
        const inicio = campo?.selectionStart ?? atual.length
        const fim = campo?.selectionEnd ?? atual.length
        atualizar(atual.slice(0, inicio) + emoji + atual.slice(fim))
        window.requestAnimationFrame(() => {
            campo?.focus()
            campo?.setSelectionRange(inicio + emoji.length, inicio + emoji.length)
        })
    }

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
                            innerRef={campoRef}
                            className="input-comentario"
                            placeholder="Insira um comentário"
                            aria-label="Comentário"
                            style={{ height: '100px' }}
                        />
                    </div>
                    <ErrorMessage name="legenda" component="div" className="text-danger form-error mb-2" />
                    <ErrorMessage name="imagem" component="div" className="text-danger form-error mb-2" />
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
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
                            <SeletorEmoji
                                onSelecionar={(emoji) =>
                                    inserirEmoji(emoji, values.legenda, (texto) => void setFieldValue('legenda', texto))
                                }
                            />
                        </div>
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
