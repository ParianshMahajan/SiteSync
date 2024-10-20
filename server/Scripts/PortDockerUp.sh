#!/bin/bash

# Arguments:
# $1 -> Directory path where the files will be created
# $2 -> Access token for git
# $3 -> Dockerfile content (string)
# $4 -> Docker Compose content (string)
# $5 -> .env filename (optional, default: ".env" if empty)
# $6 -> Env content (string)

# Set defaults if necessary (if envname is empty, default to .env)
ENVNAME=${5:-}

# Navigate to the specified directory
cd "$1" || { echo "Directory not found"; exit 1; }

# Create Dockerfile
echo "$3" > Dockerfile

# Create docker-compose.yml
echo "$4" > docker-compose.yml

# Create environment file (.env or custom envname.env)
if [ -z "$ENVNAME" ]; then
    echo "$6" > .env
else
    echo "$6" > "$ENVNAME".env
fi

# Run Docker commands
sudo docker compose up --build -d

# Git operations
git add .
git commit -m "Added Docker and environment files"
git push https://"$2"@github.com/$(git remote get-url origin | cut -d'/' -f4-)

