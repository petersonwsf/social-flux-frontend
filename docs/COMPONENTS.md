# Componentes — FrontEnd

Componentes reutilizáveis em `src/components/`, agrupados por área. Antes de criar um componente novo, procure aqui um que
já resolva (ou que possa ganhar uma prop). Ao criar/alterar um componente, atualize este arquivo no mesmo commit.

Convenções: um componente por arquivo com `export default` (exceto `FormField.tsx` e `PostActions.tsx`, que exportam mais de um);
estilo com classes do Bootstrap e de `src/styles/components.css`; ícones com `<ion-icon name="...">` (registre ícones novos em
`src/lib/icons.ts`); modais são do Bootstrap, abertos por `data-bs-toggle="modal"` + `data-bs-target="#<id>"`, por isso recebem um `id`.

Legenda da coluna **Usado em**: onde o componente é usado hoje (ajuda a medir o impacto de uma mudança).

## `common/` — genéricos, sem regra de negócio

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `Avatar` | `src/components/common/Avatar.tsx` | Foto de perfil circular com fallback para a imagem padrão; monta a URL com `getAvatarUrl` | `user?` (`foto_perfil`, `username`), `size?` (px ou CSS) + qualquer atributo de `<img>` | sidebar, cards de usuário/postagem, perfil, editar perfil |
| `ButtonBack` | `src/components/common/ButtonBack.tsx` | Botão de ícone "voltar" (`navigate(-1)`) | — | quase todas as páginas autenticadas |
| `Loading` | `src/components/common/Loading.tsx` | Animação de carregamento | — | `Perfil` |
| `NoContent` | `src/components/common/NoContent.tsx` | Ilustração + mensagem para listas vazias | `msg` | `Home`, `PerfilPostagens` |
| `NotFoundMessage` | `src/components/common/NotFoundMessage.tsx` | Ilustração + mensagem de item não encontrado | `msg` | `Perfil`, `PostPage` |
| `ProtectedContent` | `src/components/common/ProtectedContent.tsx` | Aviso de conteúdo protegido (perfil privado não seguido) | — | `Perfil` |
| `TabMenu` | `src/components/common/TabMenu.tsx` | Menu de abas genérico e tipado pelo id da aba | `tabs` (`{ id, label }[]`), `active`, `onChange(id)` | `Perfil`, `Notifications` |

## `auth/` — telas de conta

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `AuthShell` | `src/components/auth/AuthShell.tsx` | Moldura (cartão centralizado com título) das telas de conta fora do login | `title`, `children` | `ForgotPassword`, `ResetPassword`, `VerifyEmail` |

## `forms/` — formulários (Formik + Yup)

Cada formulário define o próprio esquema Yup e recebe `onSubmit` assíncrono; a chamada à API fica no hook/página.

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `FormField` | `src/components/forms/FormField.tsx` | Campo de texto/textarea com label flutuante e erro do Formik (usar dentro de `<Formik>`) | `name`, `label`, `type?`, `as?: 'textarea'`, `height?` | formulários, `ForgotPassword`, `ResetPassword`, modais de senha |
| `FileField` | `src/components/forms/FormField.tsx` | Input de arquivo que grava o `File` no estado do Formik | `name`, `label`, `accept?` (padrão `image/*`), `id?` | `FormCriarPostagem`, `FormAlterarFotoPerfil` |
| `FormSignin` | `src/components/forms/FormSignin.tsx` | Login (e-mail e senha) com link para alternar ao cadastro | `onSubmit(LoginPayload)`, `toggleForm()` | `Login` |
| `FormSignup` | `src/components/forms/FormSignup.tsx` | Cadastro (e-mail, telefone, sexo, nascimento, nome, username, senha + confirmação) | `onSubmit(RegisterPayload)`, `toggleForm()` | `Login` |
| `FormCriarPostagem` | `src/components/forms/FormCriarPostagem.tsx` | Nova postagem: texto e/ou imagem (PNG, JPEG, WebP) ou GIF, com as regras de `lib/midia.ts` no cliente | `onSubmit(CriarPostagemPayload)` | `CriarPostagem` |
| `FormComentar` | `src/components/forms/FormComentar.tsx` | Resposta a uma postagem (texto e/ou imagem/GIF por modal), com avatar do usuário e validação "texto ou imagem" | `user`, `idPostagem` (UUID; gera id de modal único), `onSubmit(CriarPostagemPayload)` | `Postagem`, `PostSecondary` |
| `FormEditarPerfil` | `src/components/forms/FormEditarPerfil.tsx` | Edição de username, nome, biografia e conta privada | `user`, `onSubmit(EditarPerfilPayload)` | `EditarPerfil` |
| `FormAlterarFotoPerfil` | `src/components/forms/FormAlterarFotoPerfil.tsx` | Envio de nova foto de perfil | `onSubmit(foto: File)` | `EditarPerfil` |

## `modals/` — modais do Bootstrap

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `ModalAction` | `src/components/modals/ModalAction.tsx` | Confirmação genérica (confirmar/cancelar) | `id`, `title`, `titleAction`, `action()`, `danger?` (botão vermelho) | `Perfil` (deixar de seguir), `Settings` (sair de todos) |
| `ModalListUsers` | `src/components/modals/ModalListUsers.tsx` | Lista de usuários (`UsuarioResumo`) com avatar e link para o perfil; opcionalmente paginada ("Carregar mais"), com mensagem de erro no lugar da lista e botão "Remover" por item | `id`, `title`, `users`, `msgDefault` (lista vazia), `erro?`, `temMais?`, `carregando?`, `onCarregarMais?`, `onRemover?(usuario)` | `Perfil` (seguidores/seguidos), `RelacoesEmComum` |
| `ModalAlterarSenha` | `src/components/modals/ModalAlterarSenha.tsx` | Troca de senha (atual, nova, confirmação); usa `useConta` | `id` | `Settings` |
| `ModalExcluirUsuario` | `src/components/modals/ModalExcluirUsuario.tsx` | Exclusão da conta com senha + confirmação; usa `useConta` | `id` | `Settings` |
| `ModalImagemComentario` | `src/components/modals/ModalImagemComentario.tsx` | Escolha de imagem para anexar a um comentário | `id`, `onSelect(file \| null)` | `FormComentar` |

## `layout/` — casca das telas autenticadas

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `ProtectedLayout` | `src/components/layout/ProtectedLayout.tsx` | Rota-pai das telas autenticadas: redireciona sem sessão, monta `NotificationsProvider`, sidebar (desktop), cabeçalho e rodapé (mobile) e o `<Outlet />` | — | `App.tsx` |
| `Brand` | `src/components/layout/Brand.tsx` | Logo + nome "Social Flux" com link para `/` | `className?` | sidebar, cabeçalho mobile |
| `FooterBar` | `src/components/layout/FooterBar.tsx` | Barra de navegação fixa no rodapé (só mobile): início, busca, criar, notificações (com badge), perfil | `user` | `ProtectedLayout` |
| `Sidebar` | `src/components/layout/sidebar/Sidebar.tsx` | Sidebar fixa (só desktop) que troca entre as visões menu, busca, solicitações e notificações; menu do usuário (perfil, configurações, sair) | `user` | `ProtectedLayout` |
| `SidebarMenu` | `src/components/layout/sidebar/SidebarMenu.tsx` | Links principais da sidebar com badges de solicitações (total real, também em tooltip: "N solicitações pendentes") e de não vistas | `solicitacoesPendentes`, `naoVistas`, `onAbrirSolicitacoes`, `onAbrirBusca`, `onAbrirNotificacoes` | `Sidebar` |
| `SearchUsuario` | `src/components/layout/sidebar/SearchUsuario.tsx` | Busca de usuários dentro da sidebar | `onVoltar()` | `Sidebar` |
| `SidebarRelacoes` | `src/components/layout/sidebar/SidebarRelacoes.tsx` | Solicitações de seguir dentro da sidebar | `solicitacoes`, `temMais`, `onVoltar`, `onCarregarMais`, `onAceitar(solicitacao)`, `onRecusar(solicitacao)` | `Sidebar` |
| `NotificationsSidebar` | `src/components/layout/sidebar/NotificationsSidebar.tsx` | Notificações dentro da sidebar (marca a área como aberta: badge zerado e sem toast); marca como vistas ao voltar | `onVoltar()` | `Sidebar` |
| `SidebarBackLink` | `src/components/layout/sidebar/SidebarBackLink.tsx` | Link "voltar" das visões internas da sidebar | `onClick()` | visões da sidebar |

## `postagens/`

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `Postagem` | `src/components/postagens/Postagem.tsx` | Card completo de uma postagem (página de detalhe): autor, texto, imagem/GIF, data, contadores, curtir, comentar, excluir (só o autor) | `postagem`, `onExcluir(id)`, `onResposta?()` | `PostPage` |
| `PostSecondary` | `src/components/postagens/PostSecondary.tsx` | Card compacto para listas e para a cadeia de pais; contadores e "curti" vêm da própria postagem | `postagem`, `onExcluir(id)` | `ListarPostagens`, `PostPage` |
| `ListarPostagens` | `src/components/postagens/ListarPostagens.tsx` | Lista de `PostSecondary` que remove da lista a postagem excluída e mostra "Carregar mais" quando há outra página | `postagens`, `setPostagens`, `temMais?`, `carregandoMais?`, `onCarregarMais?()` | `Home`, `PerfilPostagens`, `PostPage` |
| `ImagemPostagem` | `src/components/postagens/ImagemPostagem.tsx` | Anexo da postagem (imagem ou GIF animado em `<img>`), com `width`/`height` da API para reservar o espaço e carregamento preguiçoso | `imagem` (`ImagemPostagem`), `className?` | `Postagem`, `PostSecondary` |
| `EmRespostaA` | `src/components/postagens/EmRespostaA.tsx` | "Em resposta a @fulano" (ou "a uma publicação" quando o pai não é visível) | `pai` (`PaiPostagem`), `comLink?` | `Postagem`, `PostSecondary` |
| `LikeButton` | `src/components/postagens/PostActions.tsx` | Botão de curtir/descurtir (coração cheio quando curtido) | `curtido` (boolean), `onToggle()` | cards de postagem |
| `CommentButton` | `src/components/postagens/PostActions.tsx` | Botão de comentar | `onClick()` | cards de postagem |
| `DropdownActions` | `src/components/postagens/DropdownActions.tsx` | Menu "⋯" da postagem com a ação excluir | `onExcluir()` | cards de postagem (só do autor) |

## `perfil/`

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `InfoPerfil` | `src/components/perfil/InfoPerfil.tsx` | Cabeçalho do perfil: avatar, nome, bio, contadores, ações e seguidores em comum. Exporta os ids de modal `MODAL_SEGUIDORES`, `MODAL_SEGUIDOS`, `MODAL_DEIXAR_DE_SEGUIR` | `perfil`, `user`, `numeroSeguidores`, `numeroSeguidos`, `estado`, `onSeguir`, `onCancelarSolicitacao` | `Perfil` |
| `ActionsProfile` | `src/components/perfil/ActionsProfile.tsx` | Botão conforme o estado da relação: editar perfil (próprio), seguir (`NENHUM`), solicitado (`SOLICITADO`, cancela) ou seguindo (`SEGUINDO`, abre confirmação) | `ehProprioPerfil`, `estado`, `onSeguir`, `onCancelarSolicitacao`, `modalDeixarDeSeguirId` | `InfoPerfil` |
| `NumeroRelacoes` | `src/components/perfil/NumeroRelacoes.tsx` | Contador clicável (seguidores/seguindo) que abre um modal | `label`, `numero`, `modalId` | `InfoPerfil` |

## `relacoes/`

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `CardRelacaoNaoAceita` | `src/components/relacoes/CardRelacaoNaoAceita.tsx` | Solicitação de seguir com botões aceitar/recusar | `solicitacao` (`ItemRelacao`), `onAceitar`, `onRecusar` | `ListaRelacoesNaoAceitas` |
| `ListaRelacoesNaoAceitas` | `src/components/relacoes/ListaRelacoesNaoAceitas.tsx` | Lista de solicitações pendentes (ou mensagem de vazio), com "Carregar mais" | `solicitacoes`, `onAceitar`, `onRecusar`, `temMais?`, `onCarregarMais?` | `Notifications`, `SidebarRelacoes` |
| `RelacoesEmComum` | `src/components/relacoes/RelacoesEmComum.tsx` | "Seguido por X, Y e mais N" (N vem do `total` da API) com modal da lista (mostra até 3) | `user`, `perfil` | `InfoPerfil` |

## `usuarios/`

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `CardUsuarioSearch` | `src/components/usuarios/CardUsuarioSearch.tsx` | Item de resultado de busca: avatar, username, nome e nº de usuários em comum, com link para o perfil | `userSearched` | `ResultadosPesquisa` |
| `ResultadosPesquisa` | `src/components/usuarios/ResultadosPesquisa.tsx` | Lista de resultados da busca (ou "nenhum resultado") | `busca`, `resultados` | `SearchUser`, `SearchUsuario` |

## `notifications/`

| Componente | Caminho | Para que serve | Props principais | Usado em |
| --- | --- | --- | --- | --- |
| `Notification` | `src/components/notifications/Notification.tsx` | Uma notificação (grupo): ícone por tipo, até 2 avatares, frase agrupada, trecho da resposta, tempo relativo e link para a postagem/perfil; em `FOLLOW_REQUEST`, botões **Aceitar/Recusar** | `notificacao`, `onAceitar?`, `onRecusar?` | `ListNotifications` |
| `ListNotifications` | `src/components/notifications/ListNotifications.tsx` | Lista de notificações (mensagem de vazio e "Carregar mais") | `notifications`, `onAceitar?`, `onRecusar?`, `temMais?`, `carregando?`, `onCarregarMais?` | `Notifications`, `NotificationsSidebar` |
