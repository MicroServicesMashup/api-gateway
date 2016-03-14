FROM mhart/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV DISCOVERY_URLS=http://46.101.251.23:8500
ENV SERVICE_NAME=music-store-management

EXPOSE 8080

ENTRYPOINT node index.js
