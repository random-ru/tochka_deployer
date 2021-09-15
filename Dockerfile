FROM node:16-alpine

RUN apk update && apk add openssh-client bash

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start" ]
