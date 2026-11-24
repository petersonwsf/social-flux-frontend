import { useEffect, useRef, useState } from 'react'
import { Form, Formik, type FormikErrors } from 'formik'
import { useCriarPostagem } from '../../hooks/usePostagemActions'
import { emitirPostagemCriada } from '../../lib/eventosPostagem'
import { inserirEmojiNoCampo } from '../../lib/emoji'
import { MAX_IMAGENS, MAX_LEGENDA, TIPOS_ACEITOS, temConteudo, validarAnexos } from '../../lib/midia'
import Avatar from '../common/Avatar'
import SeletorEmoji from '../forms/SeletorEmoji'
import type { CriarPostagemPayload, Usuario } from '../../types/api'

export const MODAL_POSTAR = 'modalPostar'

function validar(values: CriarPostagemPayload): FormikErrors<CriarPostagemPayload> {
    const erroAnexo = validarAnexos(values.imagens)
    if (erroAnexo) return { imagens: erroAnexo }
    if (values.legenda.length > MAX_LEGENDA) return { legenda: `O texto pode ter no máximo ${MAX_LEGENDA} caracteres` }
    return {}
}

/** Miniatura de um anexo escolhido, com botão para removê-lo. */
function PreviaImagem({ arquivo, onRemover }: { arquivo: File; onRemover: () => void }) {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        const criada = URL.createObjectURL(arquivo)
        setUrl(criada)
        return () => URL.revokeObjectURL(criada)
    }, [arquivo])

    if (!url) return null
    return (
        <div className="previa-imagem position-relative">
            <img src={url} alt="Pré-visualização do anexo" className="rounded-3" />
            <button
                type="button"
                className="btn btn-icon previa-imagem-remover"
                onClick={onRemover}
                aria-label="Remover imagem"
            >
                <ion-icon name="close-outline"></ion-icon>
            </button>
        </div>
    )
}

/** Miniaturas dos anexos escolhidos (até 5), alinhadas ao texto. */
function PreviaImagens({ arquivos, onRemover }: { arquivos: File[]; onRemover: (indice: number) => void }) {
    if (arquivos.length === 0) return null
    return (
        <div className="previas-imagens mt-2 ms-5 ps-2">
            {arquivos.map((arquivo, indice) => (
                <PreviaImagem
                    key={`${arquivo.name}-${arquivo.size}-${arquivo.lastModified}-${indice}`}
                    arquivo={arquivo}
                    onRemover={() => onRemover(indice)}
                />
            ))}
        </div>
    )
}

/** Modal "Postar": texto (com emojis) e/ou até 5 imagens ou um GIF; ao publicar, avisa o feed e o perfil abertos. */
function ModalPostar({ user }: { user: Usuario }) {
    const { criarPostagem } = useCriarPostagem(emitirPostagemCriada)
    const [versao, setVersao] = useState(0)
    const campoRef = useRef<HTMLTextAreaElement>(null)
    const arquivoRef = useRef<HTMLInputElement>(null)
    const fecharRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const aoMostrar = (evento: Event) => {
            if (evento.target instanceof HTMLElement && evento.target.id === MODAL_POSTAR) campoRef.current?.focus()
        }
        const aoFechar = (evento: Event) => {
            if (evento.target instanceof HTMLElement && evento.target.id === MODAL_POSTAR) setVersao((v) => v + 1)
        }
        document.addEventListener('shown.bs.modal', aoMostrar)
        document.addEventListener('hidden.bs.modal', aoFechar)
        return () => {
            document.removeEventListener('shown.bs.modal', aoMostrar)
            document.removeEventListener('hidden.bs.modal', aoFechar)
        }
    }, [])

    return (
        <div className="modal fade" id={MODAL_POSTAR} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content modal-postar">
                    <div className="modal-body p-3">
                        <button
                            ref={fecharRef}
                            type="button"
                            className="btn btn-icon mb-2"
                            data-bs-dismiss="modal"
                            aria-label="Fechar"
                        >
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                        <Formik
                            key={versao}
                            initialValues={{ legenda: '', imagens: [] } as CriarPostagemPayload}
                            validate={validar}
                            validateOnBlur={false}
                            validateOnChange
                            onSubmit={async (values) => {
                                const criada = await criarPostagem(values)
                                if (criada) fecharRef.current?.click()
                            }}
                        >
                            {({ values, errors, isSubmitting, setFieldValue }) => (
                                <Form noValidate>
                                    <div className="d-flex">
                                        <Avatar user={user} size="42px" className="me-3 flex-shrink-0" alt="" />
                                        <textarea
                                            ref={campoRef}
                                            className="campo-postar"
                                            rows={5}
                                            placeholder="O que está acontecendo?"
                                            aria-label="Texto da postagem"
                                            value={values.legenda}
                                            onChange={(evento) => void setFieldValue('legenda', evento.target.value)}
                                        />
                                    </div>
                                    <PreviaImagens
                                        arquivos={values.imagens}
                                        onRemover={(indice) =>
                                            void setFieldValue(
                                                'imagens',
                                                values.imagens.filter((_, posicao) => posicao !== indice),
                                            )
                                        }
                                    />
                                    {typeof errors.imagens === 'string' && (
                                        <div className="text-danger form-error ms-5 ps-2 mt-2">{errors.imagens}</div>
                                    )}
                                    {errors.legenda && <div className="text-danger form-error ms-5 ps-2 mt-2">{errors.legenda}</div>}
                                    <hr className="my-2" />
                                    <div className="d-flex align-items-center">
                                        <input
                                            ref={arquivoRef}
                                            type="file"
                                            hidden
                                            accept={TIPOS_ACEITOS}
                                            multiple
                                            onChange={(evento) => {
                                                const novos = Array.from(evento.currentTarget.files ?? [])
                                                evento.currentTarget.value = ''
                                                void setFieldValue('imagens', [...values.imagens, ...novos])
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-icon"
                                            aria-label={`Anexar imagens (até ${MAX_IMAGENS}) ou um GIF`}
                                            disabled={values.imagens.length >= MAX_IMAGENS}
                                            onClick={() => arquivoRef.current?.click()}
                                        >
                                            <ion-icon name="image-outline"></ion-icon>
                                        </button>
                                        <SeletorEmoji
                                            onSelecionar={(emoji) =>
                                                inserirEmojiNoCampo(
                                                    campoRef.current,
                                                    values.legenda,
                                                    emoji,
                                                    (texto) => void setFieldValue('legenda', texto),
                                                )
                                            }
                                        />
                                        <span className="ms-auto me-3 small text-secondary">
                                            {values.legenda.length}/{MAX_LEGENDA}
                                        </span>
                                        <button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center px-4"
                                            disabled={isSubmitting || !temConteudo(values.legenda, values.imagens)}
                                        >
                                            {isSubmitting && (
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            Postar
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

export default ModalPostar
