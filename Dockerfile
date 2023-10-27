FROM node:18

WORKDIR /usr/src/eazyrooms_payments_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3014

CMD ["node", "server.js"]