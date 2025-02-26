
FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000
ENTRYPOINT [ "bun",  "src/index.ts" ]