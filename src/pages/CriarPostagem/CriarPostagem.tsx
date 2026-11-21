import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonBack from '../../components/common/ButtonBack'
import FormCriarPostagem from '../../components/forms/FormCriarPostagem'
import { useCriarPostagem } from '../../hooks/usePostagemActions'

function CriarPostagem() {
    const navigate = useNavigate()
    const irParaInicio = useCallback(() => navigate('/'), [navigate])
    const { criarPostagem } = useCriarPostagem(irParaInicio)

    return (
        <div className="criar-postagem">
            <ButtonBack />
            <p className="display-5 text-center">Criar postagem</p>
            <div className="p-3">
                <FormCriarPostagem
                    onSubmit={async (values) => {
                        await criarPostagem(values)
                    }}
                />
            </div>
        </div>
    )
}

export default CriarPostagem
