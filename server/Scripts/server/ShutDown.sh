#!/bin/bash

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <path> <confname>"
  exit 1
fi

PATH_TO_COMPOSE=$1
CONFNAME=$2
NGINX_CONF_PATH="/etc/nginx/sites-available/$CONFNAME"

# Step 1: Run Docker Compose in the specified directory
if [ -d "$PATH_TO_COMPOSE" ]; then
  echo "Running Docker Compose at $PATH_TO_COMPOSE..."
  cd "$PATH_TO_COMPOSE" || exit
  sudo docker compose up --build -d
  echo "Docker Compose started successfully in $PATH_TO_COMPOSE."
else
  echo "Directory $PATH_TO_COMPOSE not found."
  exit 1
fi

# Step 2: Uncomment 'server_name' and 'proxy_pass http://localhost' lines in the Nginx configuration
if [ -f "$NGINX_CONF_PATH" ]; then
  echo "Modifying Nginx config file: $NGINX_CONF_PATH"

  # Uncomment the line starting with '# server_name'
  sudo sed -i '/^\s*#\s*server_name\s/s/^#//' "$NGINX_CONF_PATH"

  # Uncomment the line with '# proxy_pass http://localhost'
  sudo sed -i '/^\s*#\s*proxy_pass http:\/\/localhost/s/^#//' "$NGINX_CONF_PATH"

  echo "Nginx config updated: 'server_name' and 'proxy_pass' lines uncommented."
else
  echo "Nginx config file $NGINX_CONF_PATH not found."
  exit 1
fi

# Step 3: Reload Nginx to apply the changes
echo "Reloading Nginx..."
sudo service nginx restart
echo "Nginx reloaded successfully."
