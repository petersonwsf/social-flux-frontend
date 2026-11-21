import type { ImgHTMLAttributes } from 'react'
import defaultPhoto from '../../assets/img/profile_photo_default.png'
import { getAvatarUrl } from '../../lib/imageUrl'
import type { Usuario } from '../../types/api'

type AvatarUser = Pick<Usuario, 'foto_perfil' | 'username'>

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    user?: AvatarUser | null
    /** Largura/altura em px (ou qualquer valor CSS). Sem `size`, o tamanho vem do CSS. */
    size?: number | string
}

/** Foto de perfil circular com fallback para a imagem padrão. */
function Avatar({ user, size, className = '', style, alt, ...rest }: AvatarProps) {
    const src = user?.foto_perfil ? getAvatarUrl(user.foto_perfil) : defaultPhoto
    const dimensions = size ? { width: size, height: size, objectFit: 'cover' as const } : undefined

    return (
        <img
            src={src}
            alt={alt ?? (user ? `Foto de perfil de ${user.username}` : 'Foto de perfil')}
            className={`avatar rounded-circle ${className}`.trim()}
            style={{ ...dimensions, ...style }}
            {...rest}
        />
    )
}

export default Avatar
