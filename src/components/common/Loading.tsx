import loading from '../../assets/img/loading.webp'

/** Animação de carregamento; `width` controla o tamanho (padrão 300px). */
function Loading({ width = '300px' }: { width?: string }) {
    return (
        <div>
            <img src={loading} alt="Carregando" style={{ width, maxWidth: '100%' }} />
        </div>
    )
}

export default Loading
