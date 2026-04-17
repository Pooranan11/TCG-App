FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Dev stage — used by docker-compose.yml (hot reload)
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage — used by docker-compose.prod.yml
FROM base AS build
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build
VOLUME ["/app/dist"]

FROM nginx:1.25-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
