# Build Stage 1
FROM node:24-alpine AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./public ./public
COPY astro.config.mjs ./
COPY tsconfig.json ./

RUN yarn build

# Build Stage 2
FROM nginx:alpine
WORKDIR /www

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /www/

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]