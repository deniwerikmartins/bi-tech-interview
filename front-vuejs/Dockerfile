# Stage 1: Build da aplicação Vue.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Build de produção
RUN npm run build-only

# Stage 2: Serve com Nginx
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do Vue
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
