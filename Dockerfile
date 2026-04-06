FROM node:22-alpine AS build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/frontend/dist ./dist

ENV PORT=3000

CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]
