import { ErrorMessage, Field, useField, useFormikContext } from 'formik'

interface FormFieldProps {
    name: string
    label: string
    type?: string
    as?: 'textarea'
    /** Altura em px (útil para textarea com label flutuante). */
    height?: number
}

/** Campo de texto com label flutuante e mensagem de erro do Formik. */
export function FormField({ name, label, type = 'text', as, height }: FormFieldProps) {
    return (
        <div className="form-floating mb-3">
            <Field
                id={name}
                name={name}
                type={as ? undefined : type}
                as={as}
                placeholder={label}
                className="form-control"
                style={height ? { height } : undefined}
            />
            <label htmlFor={name}>{label}</label>
            <ErrorMessage name={name} component="div" className="text-danger form-error" />
        </div>
    )
}

interface FileFieldProps {
    name: string
    label: string
    accept?: string
    id?: string
}

/** Input de arquivo que grava o `File` selecionado no estado do Formik. */
export function FileField({ name, label, accept = 'image/*', id = name }: FileFieldProps) {
    const [, meta] = useField<File | null>(name)
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
                onChange={(event) => {
                    void setFieldValue(name, event.currentTarget.files?.[0] ?? null)
                }}
                onBlur={() => {
                    void setFieldTouched(name, true)
                }}
            />
            {meta.touched && meta.error && <div className="text-danger form-error">{meta.error}</div>}
        </div>
    )
}
