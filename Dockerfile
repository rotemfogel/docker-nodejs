FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY src src
COPY tsconfig.json tsconfig.json

RUN npm run build

FROM gcr.io/distroless/nodejs24 AS runner

WORKDIR /app

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

ENV PORT=3000 NODE_ENV=production
EXPOSE ${PORT}

CMD ["dist/index.js"]