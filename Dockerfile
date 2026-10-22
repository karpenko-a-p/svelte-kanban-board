FROM oven/bun:1.4.4-alpine AS build
WORKDIR /app
COPY package.json bun.lock* .npmrc ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.4.4-alpine AS prod-deps
WORKDIR /app
COPY package.json bun.lock* .npmrc ./
RUN bun install --production --frozen-lockfile

FROM oven/bun:1.4.4-alpine
WORKDIR /app
RUN apk add --no-cache fontconfig && fc-cache -f
COPY ./static/fonts /usr/share/fonts
COPY --from=build /app/build ./build
COPY --from=prod-deps /app/node_modules ./node_modules
COPY ./.env .
EXPOSE 3000
ENTRYPOINT ["bun", "run", "./build/index.js"]