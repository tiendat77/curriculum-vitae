# Build Stage 1
FROM node:19-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY astro.config.mjs ./
COPY tailwind.config.cjs ./
COPY tsconfig.json ./

RUN npm run build

# Build Stage 2
FROM nginx:alpine
WORKDIR /www

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /www/

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]