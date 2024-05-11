const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports.createScript = async function createScript(fpath,fname,domain,framework) {
    
    let redirects="\\$uri \\$uri/ =404"
    if(framework==true){
        redirects="\\$uri \\$uri/ /index.html"
    }

    let content = `
    #!/bin/bash

    # Server block configuration template
    server_block="server {
        listen 80;
        listen [::]:80;

        server_name ${domain};

        root ${process.env.VMPath}/${fname};
        index index.html index.htm index.nginx-debian.html;


        location / {
            try_files ${redirects};
        }
    }"

    sudo touch /etc/nginx/sites-enabled/${fname}

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error creating file."
        exit 1
    fi

    # Write the server block configuration to a temporary file
    echo "$server_block" | sudo tee /etc/nginx/sites-enabled/${fname} > /dev/null

    # Check if writing to the file was successful
    if [ $? -eq 0 ]; then
        echo "Server block configuration written to file successfully!"
    else
        echo "Error writing server block configuration to file."
        exit 1
    fi

    # Reload Nginx
    echo "Reloading Nginx..."
    sudo service nginx reload

    # Check if Nginx reload was successful
    if [ $? -eq 0 ]; then
        echo "Nginx reloaded successfully!"
    else
        echo "Error reloading Nginx."
    fi
    `;

    fs.writeFileSync(fpath, content);
    console.log("Script created successfully");
}



module.exports.startScript = async function startScript(fpath,fname,domain) {
    let content = `
    #!/bin/bash

    file_pathfname="/etc/nginx/sites-enabled/${fname}"

    # Comment out the line starting with 'server_name'
    sudo sed -i '/^\s*server_name/s/^/#/' "$file_path"

    echo "Server name line commented out successfully."

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error commenting file."
        exit 1
    fi

    # Reload Nginx
    echo "Reloading Nginx..."
    sudo service nginx reload

    # Check if Nginx reload was successful
    if [ $? -eq 0 ]; then
        echo "Nginx reloaded successfully!"
    else
        echo "Error reloading Nginx."
    fi
    `;

    fs.writeFileSync(fpath, content);

    console.log("Script created successfully");
}



module.exports.stopScript = async function stopScript(fpath,fname,domain) {
    let content = `
    #!/bin/bash

    file_pathfname="/etc/nginx/sites-enabled/${fname}"

    # Comment out the line starting with 'server_name'
    sudo sed -i '/^\s*#*\s*server_name/s/^#*//' "$file_path"

    echo "Server name line uncommented successfully."

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error commenting file."
        exit 1
    fi

    # Reload Nginx
    echo "Reloading Nginx..."
    sudo service nginx reload

    # Check if Nginx reload was successful
    if [ $? -eq 0 ]; then
        echo "Nginx reloaded successfully!"
    else
        echo "Error reloading Nginx."
    fi
    `;

    fs.writeFileSync(fpath, content);

    console.log("Script created successfully");
}

module.exports.deleteScript = async function deleteScript(fpath,fname,domain) {
    let content = `
    #!/bin/bash

    sudo rm /etc/nginx/sites-enabled/${fname}

    echo "Nginx file deleted Successfully."

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error deleting conf file."
        exit 1
    fi

    # Reload Nginx
    echo "Reloading Nginx..."
    sudo service nginx reload

    # Check if Nginx reload was successful
    if [ $? -eq 0 ]; then
        echo "Nginx reloaded successfully!"
    else
        echo "Error reloading Nginx."
    fi
    `;

    fs.writeFileSync(fpath, content);

    console.log("Script created successfully");
}
