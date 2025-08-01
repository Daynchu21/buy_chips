# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copia el resto del código y genera Prisma client
COPY . .
RUN npx prisma generate

# Construye la app Next.js
RUN npm run build

# Etapa 2: producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Solo copia lo necesario
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expone el puerto
EXPOSE 3000

# Variables de entorno (puedes usar .env o pasarlas en docker-compose)
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=public"

# Inicia la app
CMD ["npm", "start"]
