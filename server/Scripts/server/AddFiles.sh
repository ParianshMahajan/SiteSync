#!/bin/bash

# Arguments:
# $1 -> Directory path where the files will be created
# $2 -> Access token for git
# $3 -> Dockerfile content (string with escaped newlines)
# $4 -> Docker Compose content (string with escaped newlines)
# $5 -> .env filename (optional, default: ".env" if empty)
# $6 -> Env content (string with escaped newlines)

# Set defaults if necessary
env_file_name=${5:-".env"}

# Check if directory exists, if not, exit with error
if [ ! -d "$1" ]; then
    echo "Directory not found: $1"
    exit 1
fi

# Navigate to the specified directory
cd "$1" || { echo "Failed to navigate to directory: $1"; exit 1; }



# Function to convert escaped sequences into a multiline string
convertEscapedToMultiline() {
    local escaped_string="$1"
    echo -e "$escaped_string" | sed -E "s/\\\\n/\\n/g" | sed "s/\\\'/'/g"
}



# Function to create a file with the given content
create_file() {
    local file_name=$1
    local file_content=$2
    local formatted_content=$(convertEscapedToMultiline "$file_content")

    if echo -e "$formatted_content" > "$file_name"; then
        echo "$file_name created successfully."
    else
        echo "Failed to create $file_name."
        exit 1
    fi
}

# Create Dockerfile if content is provided
if [ -n "$3" ]; then
    create_file "Dockerfile" "$3"
fi

# Create docker-compose.yml if content is provided
if [ -n "$4" ]; then
    create_file "docker-compose.yml" "$4"
fi

# Create environment file (.env or custom envname.env) if content is provided
if [ -n "$6" ]; then
    create_file "$env_file_name" "$6"
fi





# Run Docker commands 
if sudo docker compose up --build -d; then
    echo "Docker containers started successfully."
else
    echo "Docker command failed."
    exit 1
fi



# Git operations only if Dockerfile or docker-compose content was provided
if [ -n "$3" ] || [ -n "$4" ]; then
    git add . || { echo "Git add failed"; exit 1; }

    if git commit -m "Added Docker and environment files"; then
        echo "Git commit successful."
    else
        echo "Git commit failed."
        exit 1
    fi

    if git push https://"$2"@github.com/$(git remote get-url origin | cut -d'/' -f4-); then
        echo "Git push successful."
    else
        echo "Git push failed."
        exit 1
    fi
fi
