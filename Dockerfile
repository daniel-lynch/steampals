FROM node:10-alpine

COPY . /app

RUN cd /app && \
    npm install

EXPOSE 80

ENTRYPOINT ["node", "/app/app.js"]