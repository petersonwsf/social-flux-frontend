import { TIPOS_ACEITOS } from '../../lib/midia'

interface ModalImagemComentarioProps {
    id: string
    /** Chamado com os arquivos escolhidos (até 5 imagens ou um GIF). */
    onSelect: (files: File[]) => void
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
                                aria-label="Imagens ou GIF do comentário"
                                multiple
                                onChange={(event) => onSelect(Array.from(event.currentTarget.files ?? []))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalImagemComentario
