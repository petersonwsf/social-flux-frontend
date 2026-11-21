# Social Flux — Frontend

React 18 + TypeScript + Vite.

## Desenvolvimento

O frontend fala só com **a própria origem** (`/auth/*` e `/api/*`): em desenvolvimento o Vite encaminha essas rotas ao
gateway (Caddy) do `docker compose` da raiz do repositório. Isso é necessário porque a sessão usa cookies `HttpOnly`.

```bash
# na raiz do repositório: sobe a infra (postgres, rabbitmq, rustfs, mailpit) e o gateway
cp .env.example .env && docker compose up -d --build

# no FrontEnd/
npm ci
npm run dev          # http://localhost:5173  (proxy -> http://localhost:8080)
```

Scripts: `npm run typecheck`, `npm run lint`, `npm run build`.

## Variáveis de ambiente

| Variável                 | Descrição                                                                 | Padrão                  |
| ------------------------ | ------------------------------------------------------------------------- | ----------------------- |
| `VITE_API_URL`           | URL base do gateway. **Vazio = mesma origem** (recomendado)               | *(vazio)*               |
| `VITE_DEV_PROXY_TARGET`  | Só `npm run dev`: para onde o Vite encaminha `/auth` e `/api`             | `http://localhost:8080` |

As variáveis `VITE_*` são embutidas no bundle em tempo de build (não coloque segredos).

## Autenticação

Feita pelo `authentication_service` (ver `../authentication_service/README.md`):

- O JWT de acesso (RS256, 2 h) e o refresh token ficam em **cookies HttpOnly**; o JavaScript nunca vê os tokens.
- `login`/`register`/`me` devolvem o usuário e `expiresAt`/`renewAt`, guardados **em memória** (`src/lib/session.ts`).
- **Sessão deslizante**: a partir de `renewAt`, a próxima requisição do usuário renova a sessão (`POST /auth/refresh`);
  um `401` também dispara uma renovação e repete a chamada uma vez (`src/lib/api.ts`). Ocioso além da tolerância,
  o usuário volta ao login. A renovação é única mesmo com várias requisições/abas (single-flight + Web Locks).
- Telas: login/cadastro, esqueci a senha, redefinir senha, confirmar e-mail; em Configurações: alterar senha,
  sair de todos os dispositivos, reenviar confirmação e excluir conta.

## Docker

A imagem só serve os arquivos estáticos (nginx sem root, porta 8080). No ambiente completo ela roda atrás do gateway
(`docker compose` da raiz); em produção, o Caddy do servidor aponta `/` para ela e `/auth`, `/api` para os serviços.

```bash
docker build -t social-flux-frontend FrontEnd   # VITE_API_URL vazio (mesma origem)
```

## Estrutura

```
src/
  components/   UI (auth, common, forms, layout, modals, notifications, perfil, postagens, relacoes, usuarios)
  contexts/     Auth, Tema, Toast e Notificações (providers)
  hooks/        Hooks de dados e de contexto
  lib/          axios (instância única + renovação de sessão), datas, erros, ícones
  pages/        Telas (rotas)
  services/     Chamadas à API, tipadas
  styles/       theme.css (paleta/tokens) e components.css
  types/        Modelos da API
```
