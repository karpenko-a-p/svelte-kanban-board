FROM node:24.13.1-alpine3.23 AS install
WORKDIR /app
COPY package*.json .
COPY .npmrc .
RUN npm cache clean -f && npm ci

FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
COPY --from=install /app .
COPY . .
RUN bun run build

FROM node:24.13.1-alpine3.23 AS omit-dev-install
WORKDIR /app
COPY package*.json .
COPY .npmrc .
RUN npm ci --omit=dev

FROM oven/bun:1.3.14-alpine
WORKDIR /app
RUN apk add --no-cache fontconfig && fc-cache -f
COPY ./static/fonts /usr/share/fonts
COPY --from=build /app/build ./build
COPY --from=omit-dev-install /app/node_modules ./node_modules
COPY ./.env .
EXPOSE 3000
ENTRYPOINT ["bun", "run", "./build/index.js"]