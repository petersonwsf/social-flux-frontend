const EMOJIS = [
    '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😎',
    '🤔', '😅', '😢', '😭', '😡', '🥳', '😴', '🤯',
    '👍', '👎', '👏', '🙌', '🙏', '💪', '👀', '🤝',
    '❤️', '🔥', '🎉', '✨', '💯', '⭐', '☕', '🚀',
]

interface SeletorEmojiProps {
    onSelecionar: (emoji: string) => void
}

/** Botão que abre uma grade de emojis (dropdown do Bootstrap); chama `onSelecionar` com o emoji escolhido. */
function SeletorEmoji({ onSelecionar }: SeletorEmojiProps) {
    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Inserir emoji"
            >
                <ion-icon name="happy-outline"></ion-icon>
            </button>
            <div className="dropdown-menu seletor-emoji p-2">
                {EMOJIS.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        className="btn btn-emoji"
                        aria-label={`Inserir ${emoji}`}
                        onClick={() => onSelecionar(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SeletorEmoji
