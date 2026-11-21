interface LikeButtonProps {
    curtido: boolean
    onToggle: () => void
}

export function LikeButton({ curtido, onToggle }: LikeButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`btn btn-icon post-action ${curtido ? 'is-liked' : ''}`}
            aria-pressed={curtido}
            aria-label={curtido ? 'Remover curtida' : 'Curtir'}
        >
            <ion-icon name={curtido ? 'heart' : 'heart-outline'}></ion-icon>
        </button>
    )
}

export function CommentButton({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="btn btn-icon post-action" aria-label="Comentar">
            <ion-icon name="chatbubble-outline"></ion-icon>
        </button>
    )
}
