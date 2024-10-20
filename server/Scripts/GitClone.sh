#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 <absolute_directory_path> <git_repo_url> <access_token> [branch]"
    exit 1
}

# Check if the number of arguments is at least 3
if [ "$#" -lt 3 ]; then
    usage
fi

# Assign variables
DIR_PATH=$1
REPO_URL=$2
ACCESS_TOKEN=$3
BRANCH=$4  # Optional branch argument



# Check if the given path is an absolute directory path
if [[ "$DIR_PATH" != /* ]]; then
    echo "Error: The directory path must be absolute."
    usage
fi



# Check if the directory exists, if not create it
if [ ! -d "$DIR_PATH" ]; then
    echo "Directory does not exist. Creating it now..."
    mkdir -p "$DIR_PATH"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create directory."
        exit 1
    fi
fi



# Navigate to the directory
cd "$DIR_PATH" || exit



# Clone the repo using access token
CLONE_URL=$(echo "$REPO_URL" | sed "s#https://#https://$ACCESS_TOKEN@#")
git clone "$CLONE_URL"



# Check if the clone was successful
if [ $? -eq 0 ]; then
    echo "Repository cloned successfully."
else
    echo "Error: Failed to clone the repository."
    exit 1
fi



# Extract the repo name from the URL
REPO_NAME=$(basename "$REPO_URL" .git)



# Navigate into the cloned repository directory
cd "$REPO_NAME" || exit



# If a branch is specified, check it out
if [ -n "$BRANCH" ]; then
    git checkout "$BRANCH"

    # Check if checkout was successful
    if [ $? -eq 0 ]; then
        echo "Switched to branch '$BRANCH'."
    else
        echo "Error: Failed to switch to branch '$BRANCH'."
        exit 1
    fi
fi
