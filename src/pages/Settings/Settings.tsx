import ButtonBack from '../../components/common/ButtonBack'
import ModalAction from '../../components/modals/ModalAction'
import ModalAlterarSenha from '../../components/modals/ModalAlterarSenha'
import ModalExcluirUsuario from '../../components/modals/ModalExcluirUsuario'
import { useAuth } from '../../hooks/useAuth'
import { useConta } from '../../hooks/useConta'
import { useTheme } from '../../hooks/useTheme'

function Settings() {
    const { darkMode, toggleTheme } = useTheme()
    const { logout, emailVerified } = useAuth()
    const { sairDeTodosOsDispositivos, reenviarVerificacao } = useConta()

    return (
        <section className="settings">
            <ButtonBack />
            <div className="px-4">
                <h2 className="display-5 mb-4">Configurações</h2>
                <div className="settings-group">
                    <p className="subtitle">Como o conteúdo será exibido para você</p>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="darkMode"
                            checked={darkMode}
                            onChange={toggleTheme}
                        />
                        <label htmlFor="darkMode" className="form-check-label">
                            Modo escuro
                        </label>
                    </div>
                </div>
                <div className="settings-group">
                    <p className="subtitle">Segurança</p>
                    {!emailVerified && (
                        <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <span>Seu e-mail ainda não foi confirmado.</span>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => void reenviarVerificacao()}
                            >
                                Reenviar e-mail
                            </button>
                        </div>
                    )}
                    <button
                        type="button"
                        className="btn btn-link d-flex align-items-center text-decoration-none ps-0"
                        data-bs-toggle="modal"
                        data-bs-target="#modalAlterarSenha"
                    >
                        <ion-icon name="lock-closed-outline"></ion-icon> Alterar senha
                    </button>
                    <button
                        type="button"
                        className="btn btn-link d-flex align-items-center text-decoration-none ps-0"
                        data-bs-toggle="modal"
                        data-bs-target="#modalSairDeTodos"
                    >
                        <ion-icon name="phone-portrait-outline"></ion-icon> Sair de todos os dispositivos
                    </button>
                </div>
                <div className="settings-group">
                    <p className="subtitle">Conta</p>
                    <button
                        type="button"
                        className="btn btn-link text-danger d-flex align-items-center text-decoration-none ps-0"
                        data-bs-toggle="modal"
                        data-bs-target="#modalLogout"
                    >
                        <ion-icon name="log-out-outline"></ion-icon> Sair
                    </button>
                    <button
                        type="button"
                        className="btn btn-link text-danger d-flex align-items-center text-decoration-none ps-0"
                        data-bs-toggle="modal"
                        data-bs-target="#modalExcluirConta"
                    >
                        <ion-icon name="close-circle-outline"></ion-icon> Excluir conta
                    </button>
                </div>
            </div>
            <ModalAction id="modalLogout" title="Deseja sair?" action={() => void logout()} titleAction="Sair" danger />
            <ModalAction
                id="modalSairDeTodos"
                title="Encerrar a sessão em todos os dispositivos?"
                action={() => void sairDeTodosOsDispositivos()}
                titleAction="Sair de todos"
                danger
            />
            <ModalAlterarSenha id="modalAlterarSenha" />
            <ModalExcluirUsuario id="modalExcluirConta" />
        </section>
    )
}

export default Settings
