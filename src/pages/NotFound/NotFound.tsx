import ButtonBack from '../../components/common/ButtonBack'
import notFound from '../../assets/img/notfound.png'

function NotFound() {
    return (
        <section className="notfound">
            <div className="w-100 pt-4">
                <ButtonBack />
            </div>
            <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: '80vh' }}>
                <img src={notFound} alt="" className="notfoundimage" />
                <h1 className="display-6">Página não encontrada</h1>
            </div>
        </section>
    )
}

export default NotFound
