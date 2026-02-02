# Backend Dockerfile (stable, non-alpine)
# Alpine + native deps (sharp/bcrypt/etc) can cause runtime SIGSEGV. Use Debian slim.

FROM node:22-bookworm-slim AS build
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

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/worker.js ./worker.js
COPY --from=build /app/package.json ./package.json

EXPOSE 3836

# Run compiled NestJS directly (worker.js now just requires dist/main.js)
CMD ["node", "dist/main.js"]
