FROM node:17-alpine3.12

EXPOSE 9898

WORKDIR /app

COPY package.json ./

RUN npm install

ADD . .

CMD npm run dev
