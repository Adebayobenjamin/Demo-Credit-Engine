FROM node:18-alpine

EXPOSE 9898

WORKDIR /app

COPY package.json ./

RUN yarn install

ADD . .

CMD npm run dev
