#!/bin/bash

# Check if at least one argument is provided
if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <ports> <confnames> <path>"
  exit 1
fi

# Extract the arrays from the input arguments
IFS=',' read -ra PORTS <<< "$1"     # Array of ports
IFS=',' read -ra CONFNAMES <<< "$2" # Array of confnames
PATH="$3"                           # Single absolute path


# Step 1: Loop through each port and stop the Docker container running on that port
for PORT in "${PORTS[@]}"; do
  echo "Processing port: $PORT..."

  # Find the Docker container running on the given port and kill it
  CONTAINER_ID=$(docker ps --filter "publish=$PORT" --format "{{.ID}}")

  if [ -n "$CONTAINER_ID" ]; then
    echo "Stopping Docker container running on port $PORT..."
    docker stop "$CONTAINER_ID"
    echo "Docker container $CONTAINER_ID stopped."
  else
    echo "No Docker container found running on port $PORT."
  fi
done

# Step 2: Loop through each confname and remove the associated Nginx config from sites-available and sites-enabled
for CONFNAME in "${CONFNAMES[@]}"; do
  NGINX_CONF_AVAILABLE_PATH="/etc/nginx/sites-available/$CONFNAME"
  NGINX_CONF_ENABLED_PATH="/etc/nginx/sites-enabled/$CONFNAME"

  echo "Processing confname: $CONFNAME..."

  # Remove confname from sites-available
  if [ -f "$NGINX_CONF_AVAILABLE_PATH" ]; then
    echo "Removing Nginx config file: $NGINX_CONF_AVAILABLE_PATH"
    sudo rm "$NGINX_CONF_AVAILABLE_PATH"
  else
    echo "Nginx config file $NGINX_CONF_AVAILABLE_PATH not found."
  fi

  # Remove confname from sites-enabled
  if [ -f "$NGINX_CONF_ENABLED_PATH" ]; then
    echo "Removing Nginx config link: $NGINX_CONF_ENABLED_PATH"
    sudo rm "$NGINX_CONF_ENABLED_PATH"
  else
    echo "Nginx config link $NGINX_CONF_ENABLED_PATH not found."
  fi
done


# Step 3: Delete the directory specified by the path
if [ -d "$PATH" ]; then
  echo "Deleting directory: $PATH"
  sudo rm -rf "$PATH"
  echo "Directory $PATH deleted."
else
  echo "Directory $PATH not found."
  exit 1
fi


# Step 4: Reload Nginx to apply the changes
echo "Reloading Nginx..."
sudo service nginx restart
echo "Nginx reloaded successfully."
