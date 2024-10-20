#!/bin/bash

# Arguments:
# $1 -> Port number
# $2 -> Domain name

# Check if the correct number of arguments is passed
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <port> <domain>"
    exit 1
fi

PORT=$1
DOMAIN=$2

# Create the Nginx server block
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

sudo bash -c "cat > $NGINX_CONF" <<EOL
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

# Enable the server block by creating a symlink
sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test the Nginx configuration for errors
sudo nginx -t

# Reload Nginx to apply the changes
sudo service nginx restart

echo "Nginx server block for $DOMAIN on port $PORT created and enabled."
