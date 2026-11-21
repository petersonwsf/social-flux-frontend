import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'

// Declara o web component <ion-icon> (carregado via CDN) para o JSX tipado.
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
                name?: string
                style?: CSSProperties
            }
        }
    }
}
