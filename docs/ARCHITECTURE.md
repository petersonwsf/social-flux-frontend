# Arquitetura — FrontEnd

SPA do Social Flux. React 18 + TypeScript (strict) + Vite 5 · Bootstrap 5.3 (CSS + JS via `data-bs-*`) · Formik + Yup ·
axios · react-router-dom 6 · ionicons (web component `<ion-icon>`) · date-fns. Porta **5173** em desenvolvimento.

Componentes reutilizáveis: [`COMPONENTS.md`](COMPONENTS.md). Como rodar e autenticação: [`../README.md`](../README.md).
Visão do monorepo: [`../../docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md).

## Como funciona

- Fala **só com a própria origem** (`/auth`, `/api`, `/media`): em produção/containers o Caddy roteia; em `npm run dev` o
  proxy do Vite encaminha ao gateway (`http://localhost:8080`). Necessário porque a sessão usa **cookies HttpOnly**.
- O JavaScript nunca vê os tokens: guarda só `expiresAt`/`renewAt` em memória (`lib/session.ts`). A instância única do axios
  (`lib/api.ts`) renova a sessão (`POST /auth/refresh`) a partir de `renewAt` ou após um `401`, uma única vez por vez (single-flight + Web Locks).
- Conta (authentication_service) e perfil (profile_service) são buscados separadamente pelo `AuthProvider`.
- Fluxo de dados: **página → hook → service → `api` (axios)**. Páginas compõem componentes; hooks guardam estado e chamam os services;
  services só fazem a chamada HTTP tipada.
- Layout responsivo: em telas `lg+` uma sidebar fixa; abaixo disso, cabeçalho no topo e barra de navegação fixa no rodapé.

## Rotas (`src/App.tsx`)

| Rota | Página | Acesso |
| --- | --- | --- |
| `/login` | `Login` (alterna entre entrar e cadastrar) | pública |
| `/forgot-password` | `ForgotPassword` | pública |
| `/reset-password?token=` | `ResetPassword` | pública |
| `/verify-email?token=` | `VerifyEmail` | pública |
| `/` | `Home` (feed de quem o usuário segue) | autenticada |
| `/perfil/:username` | `Perfil` | autenticada |
| `/editar` | `EditarPerfil` | autenticada |
| `/criarPost` | `CriarPostagem` | autenticada |
| `/postagem/:id` | `PostPage` (postagem + respostas) | autenticada |
| `/search` | `SearchUser` (busca no mobile) | autenticada |
| `/notifications` | `Notifications` (notificações e solicitações no mobile) | autenticada |
| `/settings` | `Settings` | autenticada |
| `*` | `NotFound` | pública |

As rotas autenticadas ficam dentro de `ProtectedLayout`, que redireciona para `/login` sem sessão.

## Árvore de diretórios

```
FrontEnd/
├── Dockerfile                    build Node 22 (npm ci + vite build, VITE_* como build args) → nginx sem root na porta 8080
├── .dockerignore / .gitignore    exclui node_modules, dist, logs, arquivos locais
├── nginx.conf                    serve o build: cache longo em /assets, fallback de SPA para index.html
├── index.html                    HTML de entrada do Vite (favicon /logo.ico, div#root)
├── package.json / package-lock.json   dependências e scripts (dev, build, typecheck, lint, preview, start)
├── vite.config.ts                plugin React e proxy de /auth, /api, /media e /.well-known para o gateway
├── tsconfig.json                 referências para tsconfig.app.json e tsconfig.node.json
├── tsconfig.app.json             TS do app: strict, noUnusedLocals/Parameters, noUncheckedIndexedAccess
├── tsconfig.node.json            TS dos arquivos de configuração (vite.config.ts)
├── eslint.config.js              ESLint 9 (typescript-eslint, react, react-hooks, react-refresh)
├── .env.example                  VITE_API_URL (vazio = mesma origem)
├── README.md                     desenvolvimento, variáveis, autenticação e Docker
├── docs/                         ARCHITECTURE.md (este) e COMPONENTS.md
├── public/logo.ico               favicon
├── dist/                         (não versionado) saída do build
└── src/
    ├── main.tsx                  ponto de entrada
    ├── App.tsx                   rotas
    ├── assets/img/               imagens estáticas
    ├── components/               componentes reutilizáveis, por área (ver COMPONENTS.md)
    ├── config/                   variáveis de ambiente
    ├── contexts/                 contextos React (auth, tema, toast, notificações)
    ├── hooks/                    hooks de dados e de acesso aos contextos
    ├── lib/                      infraestrutura: axios, sessão, datas, erros, ícones, imagens, modais
    ├── pages/                    telas (uma pasta por rota)
    ├── services/                 chamadas tipadas à API, por domínio
    ├── styles/                   tema e estilos de componentes
    ├── types/                    modelos da API
    ├── ionicons.d.ts             tipagem JSX de <ion-icon>
    └── vite-env.d.ts             tipagem de import.meta.env
```

## Arquivos

### Entrada

| Arquivo | O que representa |
| --- | --- |
| `src/main.tsx` | Importa Bootstrap (CSS + JS), registra os ícones, carrega os estilos e monta `ThemeProvider > BrowserRouter > ToastProvider > AuthProvider > App` |
| `src/App.tsx` | Tabela de rotas; ao trocar de rota remove backdrops de modais órfãos |

### `src/assets/img/`

| Arquivo | Uso |
| --- | --- |
| `logo.png` | Logo da marca (`Brand`) |
| `profile_photo_default.png` | Foto padrão quando o usuário não tem avatar (`Avatar`) |
| `loading.webp` | Animação de carregamento (`Loading`) |
| `posts.png` | Ilustração de "sem conteúdo" (`NoContent`) |
| `cadeado.webp` | Ilustração de conteúdo protegido / perfil privado (`ProtectedContent`) |
| `notfound.png` | Ilustração de não encontrado (`NotFoundMessage`, página `NotFound`) |
| `messi.jpg` | Não é usado em nenhum lugar |

### `src/config/`

| Arquivo | O que representa |
| --- | --- |
| `env.ts` | `API_URL` (de `VITE_API_URL`, sem barra final; vazio = mesma origem) e `API_BASE_URL` (`${API_URL}/api`) |

### `src/contexts/`

Cada contexto tem um arquivo `xxxContext.ts` (tipo + `createContext`) e um `XxxProvider.tsx` (estado e efeitos), separados para o Fast Refresh.

| Arquivo | O que representa |
| --- | --- |
| `authContext.ts` / `AuthProvider.tsx` | Sessão: `user` (perfil), `account` (UUID, e-mail), `emailVerified`, `carregando`, `login`, `register`, `logout`, `applyAuth`, `updateUser`, `refreshUser`. Restaura a sessão pelos cookies ao abrir, apaga o token antigo do `localStorage` e volta ao login quando a sessão não pode ser renovada |
| `themeContext.ts` / `ThemeProvider.tsx` | Tema claro/escuro via `data-bs-theme` do Bootstrap, persistido no `localStorage` (migra a chave antiga do redux-persist) |
| `toastContext.ts` / `ToastProvider.tsx` | Fila de toasts (`success`, `error` e `notify` para `{ mensagem, sucesso }`) renderizada em `.toast-stack` |
| `notificationsContext.ts` / `NotificationsProvider.tsx` | Notificações do usuário logado (agrupadas, paginadas), contador de não vistas, aceitar/recusar solicitação direto da notificação e o **tempo real**: carrega a primeira página e liga o stream (`lib/notificacoesTempoReal.ts`); eventos `notificacao`/`removida`/`contagem`/`recarregar` atualizam a lista; toast quando chega algo fora da área de notificações (`abrirArea` marca a área aberta); montado dentro do `ProtectedLayout` |

### `src/hooks/`

| Arquivo | O que representa |
| --- | --- |
| `useAuth.ts` | `useAuth()` (contexto de auth) e `useCurrentUser()` (usuário garantido em telas protegidas) |
| `useTheme.ts` / `useToast.ts` / `useNotificacoes.ts` | Acesso aos respectivos contextos (erro se usados fora do provider) |
| `useConta.ts` | Ações da conta: editar perfil, trocar foto, alterar senha, sair de todos os dispositivos, reenviar verificação, excluir conta |
| `usePerfil.ts` | Carrega um perfil por username (`naoEncontrado` em 404) |
| `usePesquisaUsuarios.ts` | Busca de usuários com debounce |
| `usePostagens.ts` | Listas paginadas por cursor (`carregarMais`, `temMais`, `carregandoMais`): `useFeed`, `usePostagensUsuario` (abas posts/interações/mídia; autor pelo UUID da conta) e `useRespostas` |
| `usePostagemDetalhe.ts` | Postagem da página de detalhe e a cadeia de pais (`/ancestrais`); `naoEncontrada` em 404; versão das respostas para recarregar |
| `usePostagemActions.ts` | `useCriarPostagem` (postagem ou resposta; devolve a postagem criada) e `useExcluirPostagem` |
| `usePostagemInteracoes.ts` | Junta curtidas, número de respostas (vindo da postagem, +1 local ao comentar) e o envio de comentário de um card |
| `useCurtidas.ts` | `curtido`/`curtidas` iniciais vindos da postagem; curtir/descurtir (`PUT`/`DELETE …/curtida`) usam o estado devolvido (a notificação ao autor nasce no servidor, pelo evento `post.liked.v1`) |
| `useRelacao.ts` | Relação entre o logado e o dono do perfil: `estado` (`NENHUM`/`SOLICITADO`/`SEGUINDO`), contadores e as ações seguir, deixar de seguir/cancelar e remover seguidor |
| `useListaRelacoes.ts` | Lista paginada por cursor (seguidores/seguidos): a 1ª página só é buscada quando `ativo` vira `true`; `carregarMais`, `remover` e `erro` (ex.: conta privada) |
| `useModalAberto.ts` | Diz se um modal do Bootstrap já foi aberto (evento `show.bs.modal`), para carregar o conteúdo só sob demanda |
| `useRelacoesEmComum.ts` | Seguidores em comum entre o logado e outro usuário (`itens` + `total`; `limite` opcional) |
| `useRelacoesPendentes.ts` | Solicitações de seguir recebidas (paginadas), com aceitar/recusar, `carregarMais` e `total` (número real de pendentes, vindo do servidor) |

### `src/lib/`

| Arquivo | O que representa |
| --- | --- |
| `api.ts` | Instância única do axios (`withCredentials`) com interceptors de renovação de sessão e repetição após `401`; `setUnauthorizedHandler`; `aoSucessoDaApi` (avisa quando uma chamada do usuário dá certo: religa o tempo real parado por 401) |
| `notificacoesStream.ts` | Um stream SSE (`EventSource`) com reconexão própria: `encerrado` reconecta já; queda → sonda sem renovar a sessão (200: espera crescente e reconecta com `?desde=`; 401: PARA até o usuário agir). Valida cada evento (sem `any`) |
| `notificacoesTempoReal.ts` | Aba líder (D10): Web Locks elege a aba que abre o stream e o BroadcastChannel repassa eventos e atividade às outras; se a líder fecha, outra assume. Sem essas APIs, um stream por aba |
| `notificacoesTexto.ts` | Frases agrupadas ("Ana, Bia e mais 3 curtiram sua publicação") e destino de cada notificação |
| `session.ts` | Temporização da sessão em memória (`setSessionTiming`, `shouldRenewSession`) e `refreshSession` (renovação única, com Web Locks entre abas) |
| `errors.ts` | `getErrorMessage` (texto de qualquer erro) e `getErrorStatus` (status HTTP do axios) |
| `dates.ts` | `calcTempPost` (tempo relativo curto) e `formatDate`, a partir de datas ISO-8601 (UTC) |
| `imageUrl.ts` | `getAvatarUrl` (chave `av_…` → `/media/avatars/…`, pública) e `getPostImageUrl` (`imagem.url` da postagem → `/media/posts/…`, autenticada pelo cookie) |
| `midia.ts` | Regras de anexo conferidas no cliente só por conveniência: tipos aceitos (PNG, JPEG, WebP, GIF), 5 MB/8 MB, texto ≤ 1.000, "texto ou imagem" |
| `autoria.ts` | `ehDoUsuario(autor, user)`: compara o `id` (UUID da conta, o único id de usuário) |
| `icons.ts` | Registra `<ion-icon>` e embute só os ícones usados (adicione aqui cada ícone novo) |
| `bootstrapModal.ts` | `resetBootstrapModals`: remove backdrop/estado de modais que ficaram abertos ao desmontar a tela |

### `src/pages/`

| Arquivo | O que representa |
| --- | --- |
| `Login/Login.tsx` | Alterna `FormSignin`/`FormSignup`; redireciona para `/` se já logado |
| `ForgotPassword/ForgotPassword.tsx` | Pede o e-mail para redefinição (resposta sempre genérica) |
| `ResetPassword/ResetPassword.tsx` | Define a nova senha com o `token` da URL |
| `VerifyEmail/VerifyEmail.tsx` | Confirma o e-mail com o `token` da URL (chamada única mesmo no StrictMode) |
| `Home/Home.tsx` | Feed paginado das pessoas seguidas ("Carregar mais") |
| `Perfil/Perfil.tsx` | Perfil: informações, seguir, seguidores/seguidos (modais paginados, carregados ao abrir; o dono pode remover seguidores), abas de postagens; conteúdo protegido em conta privada não seguida |
| `Perfil/PerfilPostagens.tsx` | Lista paginada das postagens do perfil conforme a aba (posts, interações, mídia) |
| `EditarPerfil/EditarPerfil.tsx` | Edição de dados do perfil e troca da foto |
| `CriarPostagem/CriarPostagem.tsx` | Nova postagem (texto e/ou imagem ou GIF) |
| `PostPage/PostPage.tsx` | Postagem completa (`/postagem/:id`, id UUID), cadeia de pais (`/ancestrais`) acima e respostas paginadas |
| `SearchUser/SearchUser.tsx` | Busca de usuários (no desktop a busca fica na sidebar) |
| `Notifications/Notifications.tsx` | Abas de notificações (agrupadas, com Aceitar/Recusar nas solicitações) e solicitações; zera o badge e liga o modo "área aberta" (sem toast) ao abrir, e marca como vistas ao sair |
| `Settings/Settings.tsx` | Tema, alterar senha, sair, sair de todos os dispositivos, reenviar verificação e excluir conta |
| `NotFound/NotFound.tsx` | Página 404 |

### `src/services/`

Uma função por chamada, sempre pela instância `api`. Os nomes de rota estão no `README.md` de cada serviço.

| Arquivo | O que representa |
| --- | --- |
| `authService.ts` | authentication_service (`/auth/*`): login, register, me, logout, logoutAll, verifyEmail, resendVerification, forgotPassword, resetPassword, changePassword, deleteAccount (a renovação fica em `lib/session.ts`) |
| `usuarioService.ts` | profile_service: meu perfil, perfil por username, pesquisa, editar perfil, trocar foto |
| `postagemService.ts` | post_service (`/api/postagens`): criar (multipart `legenda`/`imagem`/`pai`), remover, buscar, respostas, ancestrais, feed e postagens do usuário por filtro (paginados por cursor), curtir e descurtir. Só informa o ALVO; quem age vem do token |
| `relacaoService.ts` | social_graph_service (`/api/relacoes`): estado, contagens, seguir, deixar de seguir/cancelar, remover seguidor, seguidores/seguidos paginados, em comum, solicitações recebidas, aceitar e recusar. Só informa o ALVO; quem age vem do token |
| `notificationService.ts` | notification_service (`/api/notificacoes`): `listar` (cursor), `contarNaoVistas` (com `semRenovar` para a sonda do tempo real) e `marcarComoVistas(ate)`. O frontend **não cria** notificações: elas nascem dos eventos no servidor |

### `src/styles/`

| Arquivo | O que representa |
| --- | --- |
| `theme.css` | Paleta e tokens (variáveis CSS) para os temas claro e escuro, sobre o Bootstrap |
| `components.css` | Estilos próprios: sidebar, barras mobile, cards de postagem, avatar, toasts etc. |

### `src/types/` e declarações

| Arquivo | O que representa |
| --- | --- |
| `types/api.ts` | Modelos e payloads da API (`Usuario`, `UsuarioResumo`, `Postagem` (com `ImagemPostagem`, `PaiPostagem`), `PaginaPostagens`, `EstadoCurtida`, `EstadoRelacao`, `RelacaoComUsuario`, `ContagensRelacao`, `ItemRelacao`, `PaginaRelacoes`, `PaginaSolicitacoes`, `EmComum`, `Notificacao` (grupo), `AtorNotificacao`, `PaginaNotificacoes`, `Mensagem`, respostas de auth...) |
| `ionicons.d.ts` | Declara `<ion-icon>` no JSX |
| `vite-env.d.ts` | Referência aos tipos do Vite e tipagem de `import.meta.env` (`VITE_API_URL`) |

## `.github/workflows/`

| Arquivo | O que faz |
| --- | --- |
| `ci.yml` | CI em cada pull request: lint e, só se passar, testes |
| `cd.yml` | CD após o merge na `main`: repete os testes, publica a imagem no GHCR e atualiza o container na VPS por SSH (secrets listados no `docs/ARCHITECTURE.md` da raiz) |
