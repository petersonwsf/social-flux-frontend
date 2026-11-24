import { useEffect } from 'react'
import type { Postagem } from '../types/api'

/**
 * Aviso entre telas de que uma postagem foi criada (ex.: no modal "Postar" da sidebar), para que o feed e o perfil
 * que já estão abertos mostrem a nova postagem sem recarregar a página.
 */
const EVENTO = 'socialflux:postagem-criada'
const alvo = new EventTarget()

export function emitirPostagemCriada(postagem: Postagem): void {
    alvo.dispatchEvent(new CustomEvent<Postagem>(EVENTO, { detail: postagem }))
}

/** Chama `aoCriar` a cada postagem criada enquanto o componente estiver montado. */
export function useAoCriarPostagem(aoCriar: (postagem: Postagem) => void): void {
    useEffect(() => {
        const ouvinte = (evento: Event) => aoCriar((evento as CustomEvent<Postagem>).detail)
        alvo.addEventListener(EVENTO, ouvinte)
        return () => alvo.removeEventListener(EVENTO, ouvinte)
    }, [aoCriar])
}
