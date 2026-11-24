import { useRef } from 'react'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import { inserirEmojiNoCampo } from '../../lib/emoji'
import SeletorEmoji from './SeletorEmoji'

interface FormFieldProps {
    name: string
    label: string
    type?: string
    as?: 'textarea'
    /** Altura em px (útil para textarea com label flutuante). */
    height?: number
    /** Só com `as="textarea"`: mostra o seletor de emojis abaixo do campo. */
    emoji?: boolean
}

/** Campo de texto com label flutuante e mensagem de erro do Formik. */
export function FormField({ name, label, type = 'text', as, height, emoji = false }: FormFieldProps) {
    const campoRef = useRef<HTMLTextAreaElement>(null)
    const [{ value }, , { setValue }] = useField<string>(name)
    const comEmoji = emoji && as === 'textarea'

    return (
        <div className="mb-3">
            <div className="form-floating">
                <Field
                    id={name}
                    name={name}
                    type={as ? undefined : type}
                    as={as}
                    innerRef={campoRef}
                    placeholder={label}
                    className="form-control"
                    style={height ? { height } : undefined}
                />
                <label htmlFor={name}>{label}</label>
            </div>
            <div className="d-flex justify-content-between align-items-start">
                <ErrorMessage name={name} component="div" className="text-danger form-error" />
                {comEmoji && (
                    <div className="ms-auto">
                        <SeletorEmoji
                            onSelecionar={(emojiEscolhido) =>
                                inserirEmojiNoCampo(campoRef.current, value, emojiEscolhido, (texto) => void setValue(texto))
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

interface FileFieldProps {
    name: string
    label: string
    accept?: string
    id?: string
    /** Vários arquivos: grava um `File[]` no campo (em vez de um `File | null`). */
    multiple?: boolean
}

/** Input de arquivo que grava o `File` (ou, com `multiple`, o `File[]`) selecionado no estado do Formik. */
export function FileField({ name, label, accept = 'image/*', id = name, multiple = false }: FileFieldProps) {
    const [, meta] = useField<File | File[] | null>(name)
    const { setFieldValue, setFieldTouched } = useFormikContext()

    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                id={id}
                className="form-control"
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(event) => {
                    const arquivos = Array.from(event.currentTarget.files ?? [])
                    void setFieldValue(name, multiple ? arquivos : (arquivos[0] ?? null))
                }}
                onBlur={() => {
                    void setFieldTouched(name, true)
                }}
            />
            {meta.touched && meta.error && <div className="text-danger form-error">{meta.error}</div>}
        </div>
    )
}
