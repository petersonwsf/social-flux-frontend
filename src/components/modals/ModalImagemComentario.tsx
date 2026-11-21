import { TIPOS_ACEITOS } from '../../lib/midia'

interface ModalImagemComentarioProps {
    id: string
    onSelect: (file: File | null) => void
}

function ModalImagemComentario({ id, onSelect }: ModalImagemComentarioProps) {
    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div className="my-4">
                            <input
                                className="form-control"
                                type="file"
                                accept={TIPOS_ACEITOS}
                                aria-label="Imagem ou GIF do comentário"
                                onChange={(event) => onSelect(event.currentTarget.files?.[0] ?? null)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalImagemComentario
