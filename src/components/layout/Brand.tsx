import { Link } from 'react-router-dom'
import logo from '../../assets/img/logo.png'

function Brand({ className = '' }: { className?: string }) {
    return (
        <Link to="/" className={`brand d-flex align-items-center text-decoration-none ${className}`.trim()}>
            <img src={logo} alt="" className="logo" />
            Social Flux
        </Link>
    )
}

export default Brand
