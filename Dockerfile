FROM node:5.8-onbuild
ENV DISCOVERY_URLS=http://46.101.175.234:8500
ENTRYPOINT node index.js
