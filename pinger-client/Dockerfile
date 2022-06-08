FROM node:14.19.0-alpine
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY packages/root/package.json packages/root/package.json

RUN yarn

COPY . .
CMD ["yarn", "dev"]
EXPOSE 3000