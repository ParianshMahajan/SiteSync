FROM node

WORKDIR /app

COPY package.json .


RUN npm install -g nodemon@latest
RUN npm install

COPY . /app

ENTRYPOINT [ "nodemon", "app.js" ]