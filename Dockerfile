# syntax=docker/dockerfile:1

# =============================================================================
# Imagem base compartilhada entre os estágios de instalação e build.
# Versão exata fixada para garantir reprodutibilidade (sem 'latest').
# Alpine é escolhido por ser bem menor que a variante Debian slim.
# =============================================================================
FROM node:22.11.0-alpine AS base

# =============================================================================
# Estágio 1 — deps
# Instala as dependências com npm ci (respeita o lock file).
# Separar este estágio do builder maximiza o cache de camadas:
# se só o código-fonte mudar, as deps não são reinstaladas.
# =============================================================================
FROM base AS deps
WORKDIR /app

# Copia apenas os manifestos de dependências primeiro
COPY package.json package-lock.json ./

# npm ci garante instalação limpa e determinística a partir do lock file
RUN npm ci

# =============================================================================
# Estágio 2 — builder
# Compila a aplicação com vite build.
# As variáveis VITE_* precisam estar disponíveis AQUI (build time) porque o
# Vite as injeta estaticamente no bundle do cliente. Por isso são declaradas
# como ARG e passadas via --build-arg (ou build.args no compose).
# =============================================================================
FROM base AS builder
WORKDIR /app

# Variáveis públicas (ficam visíveis no bundle do navegador).
# NUNCA coloque segredos aqui.
ARG VITE_API_URL=

# Expõe o ARG como ENV para que o Vite o enxergue durante o build
ENV VITE_API_URL=$VITE_API_URL

# Copia node_modules instalados no estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia o restante do código-fonte
COPY . .

# Gera os arquivos estáticos em /app/dist
RUN npm run build

# =============================================================================
# Estágio 3 — runner (imagem final de produção)
# O resultado do build é um conjunto de arquivos estáticos, então a imagem
# final não precisa de Node: apenas um nginx leve que os serve.
# A variante "unprivileged" roda como usuário não-root e escuta na porta 8080.
# Domínio e HTTPS ficam por conta do Caddy do servidor (reverse_proxy).
# =============================================================================
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

# Configuração com fallback de SPA (react-router) e cache de assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia apenas os artefatos necessários do estágio builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Healthcheck sem dependência extra: wget já vem no busybox do Alpine
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
