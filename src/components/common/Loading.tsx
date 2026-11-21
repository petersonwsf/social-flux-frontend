import loading from '../../assets/img/loading.webp'

function Loading() {
    return (
        <div>
            <img src={loading} alt="Carregando" style={{ width: '300px', maxWidth: '100%' }} />
        </div>
    )
}

export default Loading
