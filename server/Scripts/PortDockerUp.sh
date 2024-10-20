#!/bin/bash

# Arguments:
# $1 -> Directory path where the files will be created
# $2 -> Access token for git
# $3 -> Dockerfile content (string with escaped newlines)
# $4 -> Docker Compose content (string with escaped newlines)
# $5 -> .env filename (optional, default: ".env" if empty)
# $6 -> Env content (string with escaped newlines)

# Set defaults if necessary
ENVNAME=${5:-.env}

# Navigate to the specified directory
cd "$1" || { echo "Directory not found"; exit 1; }

# Create Dockerfile
echo -e "${3//\\n/$'\n'}" > Dockerfile

# Create docker-compose.yml
echo -e "${4//\\n/$'\n'}" > docker-compose.yml

# Create environment file (.env or custom envname.env)
echo -e "${6//\\n/$'\n'}" > "$ENVNAME"

# Run Docker commands
sudo docker compose up --build -d

# Git operations
git add .
git commit -m "Added Docker and environment files"
git push https://"$2"@github.com/$(git remote get-url origin | cut -d'/' -f4-)
