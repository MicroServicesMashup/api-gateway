FROM mhart/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV DISCOVERY_URLS=http://46.101.175.234:8500
EXPOSE 8080

ENTRYPOINT node index.js
