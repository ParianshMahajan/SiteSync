FROM ubuntu:latest

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    ln -s /usr/bin/nodejs /usr/bin/node && \
    npm install -g nodemon@latest

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .

RUN npm install

# Copy the rest of the application code
COPY . /app

# Define the entry point to run the application using nodemon
ENTRYPOINT [ "nodemon", "app.js" ]
