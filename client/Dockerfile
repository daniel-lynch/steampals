FROM node:10-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd
WORKDIR /usr/local/apache2/htdocs/
COPY --from=0 /app/build .
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf