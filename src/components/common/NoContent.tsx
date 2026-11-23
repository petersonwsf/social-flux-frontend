/** Estado vazio de listas: ícone (acompanha a cor do tema) + mensagem, centralizados na área disponível. */
function NoContent({ msg }: { msg: string }) {
    return (
        <div className="no-content d-flex flex-column align-items-center justify-content-center text-center w-100 my-4">
            <span className="no-content-icon d-flex">
                <ion-icon name="newspaper-outline"></ion-icon>
            </span>
            <p className="lead mt-3 mb-0">{msg}</p>
        </div>
    )
}

export default NoContent
