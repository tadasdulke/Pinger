FROM node:14.19.0
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .
EXPOSE 3000 