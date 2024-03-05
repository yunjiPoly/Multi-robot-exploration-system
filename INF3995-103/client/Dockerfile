FROM node:latest as node
WORKDIR /client
COPY package.json package-lock.json angular.json tsconfig.app.json tsconfig.json ./
RUN npm i
COPY /src/ ./src/
#RUN npm run build