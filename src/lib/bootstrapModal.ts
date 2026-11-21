/**
 * Os modais do Bootstrap são controlados por data-attributes. Quando a tela que os contém
 * é desmontada com um modal aberto (ex.: logout, troca de foto), o backdrop ficaria órfão.
 */
export function resetBootstrapModals(): void {
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove())
    document.body.classList.remove('modal-open')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')
}
