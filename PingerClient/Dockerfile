FROM node:18-alpine
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .
CMD ["yarn", "dev"]
EXPOSE 8080