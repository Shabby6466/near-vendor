FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV production
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g tsc-alias

COPY . .

EXPOSE 3836

CMD [ "npm", "run", "start:prod" ]
