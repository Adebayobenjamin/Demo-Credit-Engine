FROM node:18-alpine

EXPOSE 9898

WORKDIR /app

COPY package.json ./

RUN yarn install

ADD . .
RUN npm run build
CMD npm run start
