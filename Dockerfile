FROM node:22-bookworm-slim AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./

# Install deps
RUN npm ci --legacy-peer-deps
RUN npm i -g tsc-alias

# Build
COPY . .
RUN ls -la /app
RUN npm run prestart:prod
RUN ls -la /app/dist


FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy from builder stage using absolute paths
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/worker.js ./worker.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3837

# Run via worker.js which requires dist/main.js
CMD ["node", "worker.js"]
