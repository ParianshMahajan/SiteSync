#!/bin/bash

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <port> <confname>"
  exit 1
fi

PORT=$1
CONFNAME=$2
NGINX_CONF_PATH="/etc/nginx/sites-available/$CONFNAME"

# Step 1: Find the Docker container running on the given port and kill it
CONTAINER_ID=$(docker ps --filter "publish=$PORT" --format "{{.ID}}")

if [ -n "$CONTAINER_ID" ]; then
  echo "Stopping Docker container running on port $PORT..."
  docker stop "$CONTAINER_ID"
  echo "Docker container $CONTAINER_ID stopped."
else
  echo "No Docker container found running on port $PORT."
fi

# Step 2: Comment out 'server_name' and 'proxy_pass http://localhost' lines in the Nginx configuration
if [ -f "$NGINX_CONF_PATH" ]; then
  echo "Modifying Nginx config file: $NGINX_CONF_PATH"

  # Comment out the line starting with 'server_name'
  sudo sed -i '/^\s*server_name\s/s/^/#/' "$NGINX_CONF_PATH"

  # Comment out the line with 'proxy_pass http://localhost'
  sudo sed -i '/^\s*proxy_pass http:\/\/localhost/s/^/#/' "$NGINX_CONF_PATH"

  echo "Nginx config updated: 'server_name' and 'proxy_pass' lines commented out."
else
  echo "Nginx config file $NGINX_CONF_PATH not found."
  exit 1
fi

# Step 3: Reload Nginx to apply the changes
echo "Reloading Nginx..."
sudo service nginx restart
echo "Nginx reloaded successfully."
