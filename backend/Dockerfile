FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/ && test -f dist/main.js

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
EXPOSE 3900
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node dist/main"]
