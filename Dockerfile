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
RUN npm run prestart:prod


FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy from builder stage using relative paths (relative to WORKDIR /app in builder)
COPY --from=builder node_modules ./node_modules
COPY --from=builder dist ./dist
COPY --from=builder worker.js ./worker.js
COPY --from=builder package.json ./package.json

EXPOSE 3836

# Run via worker.js which requires dist/main.js
CMD ["node", "worker.js"]
