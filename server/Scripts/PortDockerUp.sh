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

# Ensure Dockerfile content is written correctly
cat <<EOF > Dockerfile
$3
EOF

# Ensure docker-compose.yml content is written correctly
cat <<EOF > docker-compose.yml
$4
EOF

# Create environment file (.env or custom envname.env)
if [ -z "$ENVNAME" ]; then
    cat <<EOF > .env
$6
EOF
else
    cat <<EOF > "$ENVNAME".env
$6
EOF
fi

# Run Docker commands
sudo docker compose up --build -d

# Git operations
git add .
git commit -m "Added Docker and environment files"
git push https://"$2"@github.com/$(git remote get-url origin | cut -d'/' -f4-)
