/** Modelos retornados/enviados pela API (espelham as entidades do backend). */

export type Sexo = 'M' | 'F'

/** Resposta padrão de sucesso/erro do backend. */
export interface Mensagem {
    mensagem: string
    sucesso: boolean
}

/**
 * Perfil devolvido pelo profile_service. `id` é o UUID da conta (o único id de usuário do sistema; o antigo id inteiro foi
 * removido junto com o backend legado). Dados pessoais (telefone, sexo, data_nascimento) só vêm no perfil do PRÓPRIO usuário.
 */
export interface Usuario {
    id: string
    username: string
    nome: string
    biografia: string | null
    foto_perfil: string | null
    /** Caminho público e imutável da foto (ex.: /media/avatars/av_….jpg). */
    foto_url?: string | null
    privado: boolean
    telefone?: string
    sexo?: Sexo
    data_nascimento?: string
    data_criacao?: string
}

/** Identidade da conta devolvida pelo authentication_service (o perfil vem de GET /api/usuarios/me). */
export interface AuthAccount {
    accountId: string
    email: string
    emailVerified: boolean
}

/** Resposta de /auth/login, /auth/register, /auth/me e /auth/change-password. */
export interface AuthResponse {
    account: AuthAccount
    /** ISO-8601: quando o token de acesso expira. */
    expiresAt: string
    /** ISO-8601: a partir daqui, a próxima ação do usuário renova a sessão. */
    renewAt: string
}

/** Resposta de /auth/refresh. */
export interface RefreshResponse {
    expiresAt: string
    renewAt: string
}

/** Usuário como aparece nas listas de relações e como autor de postagens: perfil público resumido, sem biografia. */
export type UsuarioResumo = Pick<Usuario, 'id' | 'username' | 'nome' | 'foto_perfil' | 'foto_url' | 'privado'>

export type TipoImagem = 'IMAGE' | 'GIF'

/** Anexo de uma postagem: `url` autenticada (/media/posts/…) e dimensões para reservar o espaço antes de carregar. */
export interface ImagemPostagem {
    url: string
    tipo: TipoImagem
    largura: number | null
    altura: number | null
}

/** Resumo do pai de uma resposta; `autor_username` é `null` quando o usuário logado não pode ver o pai. */
export interface PaiPostagem {
    id: string
    autor_username: string | null
}

/** Postagem do post_service: contadores e "curti" já vêm embutidos; `criado_em` é ISO-8601 em UTC. */
export interface Postagem {
    id: string
    legenda: string | null
    imagem: ImagemPostagem | null
    criado_em: string
    autor: UsuarioResumo
    pai: PaiPostagem | null
    curtidas: number
    curtido: boolean
    respostas: number
}

/** Página de postagens; `proximoCursor` é `null` na última página. */
export interface PaginaPostagens {
    itens: Postagem[]
    proximoCursor: string | null
}

/** Estado da curtida depois de curtir/descurtir. */
export interface EstadoCurtida {
    curtido: boolean
    curtidas: number
}

export type EstadoRelacao = 'NENHUM' | 'SOLICITADO' | 'SEGUINDO'

/** Relação do usuário logado com outro usuário. */
export interface RelacaoComUsuario {
    estado: EstadoRelacao
    /** O outro usuário segue o logado. */
    segueVoce: boolean
    /** O outro usuário pediu para seguir o logado (conta privada). */
    solicitouVoce: boolean
}

export interface ContagensRelacao {
    seguidores: number
    seguidos: number
}

/** Item de lista paginada de relações; `desde` é a data ISO-8601 da relação ou da solicitação. */
export interface ItemRelacao {
    usuario: UsuarioResumo
    desde: string
}

/** Página de uma lista de relações; `proximoCursor` é `null` na última página. */
export interface PaginaRelacoes {
    itens: ItemRelacao[]
    proximoCursor: string | null
}

/** Solicitações de seguir recebidas; `total` é o número real de pendentes, não só os itens desta página. */
export interface PaginaSolicitacoes extends PaginaRelacoes {
    total: number
}

/** Seguidores em comum; `total` é o número real, mesmo quando `itens` vem limitado. */
export interface EmComum {
    itens: UsuarioResumo[]
    total: number
}

/** notification_service: as notificações nascem dos eventos do servidor (o frontend não cria nenhuma). */
export type NotificacaoTipo = 'LIKE' | 'REPLY' | 'FOLLOW' | 'FOLLOW_REQUEST' | 'FOLLOW_ACCEPTED'

/** Quem agiu. O `id` é o UUID da conta. */
export interface AtorNotificacao {
    id: string
    username: string
    nome: string
    foto_perfil: string | null
    foto_url: string | null
}

/**
 * Uma notificação é um GRUPO de ações do mesmo tipo (ex.: várias curtidas na mesma postagem). `atores` traz só os 2 mais
 * recentes; `totalAtores` é o total. `seq` cresce a cada mudança do grupo (é o id do evento SSE e o limite de "vistas").
 */
export interface Notificacao {
    id: string
    seq: number
    tipo: NotificacaoTipo
    atores: AtorNotificacao[]
    totalAtores: number
    /** UUID da postagem alvo (curtida/resposta). */
    postagem: string | null
    /** UUID da resposta mais recente (só REPLY). */
    resposta: string | null
    trecho: string | null
    atualizada_em: string
    vista: boolean
}

export interface PaginaNotificacoes {
    itens: Notificacao[]
    proximoCursor: string | null
}

export interface LoginPayload {
    email: string
    senha: string
}

export interface RegisterPayload {
    email: string
    telefone: string
    sexo: Sexo | ''
    data_nascimento: string
    nome: string
    username: string
    senha: string
    confirmarSenha: string
}

export interface ChangePasswordPayload {
    senhaAtual: string
    novaSenha: string
}

export interface EditarPerfilPayload {
    id: string
    username: string
    nome: string
    biografia: string
    privado: boolean
}

export interface CriarPostagemPayload {
    legenda: string
    imagem: File | null
}
