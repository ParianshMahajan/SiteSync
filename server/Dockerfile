FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y nodejs npm && \
    npm install -g nodemon@latest

RUN apt-get install -y unzip
    
WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

ENTRYPOINT [ "node", "app.js" ]
