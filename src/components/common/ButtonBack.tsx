import { useNavigate } from 'react-router-dom'

function ButtonBack() {
    const navigate = useNavigate()

    return (
        <button type="button" onClick={() => navigate(-1)} className="btn btn-icon mx-2 my-lg-2" aria-label="Voltar">
            <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
    )
}

export default ButtonBack
