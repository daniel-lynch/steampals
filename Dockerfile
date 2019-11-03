FROM node:10-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

ENTRYPOINT ["node", "/app/index.js"]
