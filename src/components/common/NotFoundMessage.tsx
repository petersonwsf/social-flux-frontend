import img from '../../assets/img/notfound.png'

function NotFoundMessage({ msg }: { msg: string }) {
    return (
        <div className="text-center">
            <p className="display-5 mt-5 mb-5">{msg}</p>
            <img src={img} alt="" style={{ width: '200px', maxWidth: '100%' }} />
        </div>
    )
}

export default NotFoundMessage
