const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports.createScript = async function createScript(
  fpath,
  fname,
  domain,
  framework
) {
  let redirects = "\\$uri \\$uri/ =404";
  if (framework == true) {
    redirects = "\\$uri \\$uri/ /index.html";
  }

  let content = `
    #!/bin/bash

    # Server block configuration template
    server_block="server {
        listen 80;
        listen [::]:80;

        server_name ${domain};

        root ${process.env.UserPath}${process.env.Frontend}${fname};
        index index.html index.htm index.nginx-debian.html;

        location / {
            try_files ${redirects};
        }
    }"

    # Create the file in sites-available
    sudo touch /etc/nginx/sites-available/${fname}

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error creating file."
        exit 1
    fi

    # Write the server block configuration to the sites-available file
    echo "$server_block" | sudo tee /etc/nginx/sites-available/${fname} > /dev/null

    # Link the configuration file to sites-enabled
    sudo ln -s /etc/nginx/sites-available/${fname} /etc/nginx/sites-enabled/${fname}

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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};

module.exports.startScript = async function startScript(fpath, fname) {
  let content = `
    #!/bin/bash

    file_pathfname="/etc/nginx/sites-available/${fname}"

    # Uncomment the lines starting with '#server_name' and '#root'
    sudo sed -i '/^\\s*#\\s*server_name/s/^\\s*#\\s*//' "$file_pathfname"
    sudo sed -i '/^\\s*#\\s*root/s/^\\s*#\\s*//' "$file_pathfname"

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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};

module.exports.stopScript = async function stopScript(fpath, fname) {
  let content = `
    #!/bin/bash

    file_pathfname="/etc/nginx/sites-available/${fname}"

    # Comment out the lines starting with 'server_name' and 'root'
    sudo sed -i '/^\\s*server_name/s/^/#/' "$file_pathfname"
    sudo sed -i '/^\\s*root/s/^/#/' "$file_pathfname"

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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};

module.exports.deleteScript = async function deleteScript(fpath, fname) {
  let content = `
    #!/bin/bash

    sudo rm /etc/nginx/sites-available/${fname}
    sudo rm /etc/nginx/sites-enabled/${fname}

    echo "Nginx configuration deleted successfully."

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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};

module.exports.renameScript = async function renameScript(fpath) {
  let content = `
      #!/bin/bash
  
      oldFname=\$1
      newFname=\$2
      
      old_conf_path="/etc/nginx/sites-available/\$oldFname"
      new_conf_path="/etc/nginx/sites-available/\$newFname"
      scripts_path="${process.env.UserPath}${process.env.Frontend}\${oldFname}/scripts"
      
      # Rename the configuration file
      if [ -f "\$old_conf_path" ]; then
          sudo mv "\$old_conf_path" "\$new_conf_path"
      
          # Check if renaming was successful
          if [ $? -ne 0 ]; then
              echo "Error renaming conf file."
              exit 1
          fi

          # Update the symbolic link
          sudo rm /etc/nginx/sites-enabled/\$oldFname
          sudo ln -s \$new_conf_path /etc/nginx/sites-enabled/\$newFname
          
          echo "Configuration file renamed and link updated successfully."
      else
          echo "Old configuration file does not exist."
          exit 1
      fi
      
      # Update server_name and root in the new configuration file
      sudo sed -i "s/server_name .*;/server_name \${newFname}.pariansh.tech;/g" "\$new_conf_path"
      sudo sed -i "s|root .*;|root ${process.env.UserPath}${process.env.Frontend}\${newFname};|g" "\$new_conf_path"
      
      # Check if the sed commands were successful
      if [ $? -ne 0 ]; then
          echo "Error updating configuration file."
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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};

module.exports.updateScript = async function updateScript(fpath) {
  let content = `
    #!/bin/bash

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

  try {
    fs.writeFileSync(fpath, content, { mode: 0o755 });
    console.log("Script created successfully");
  } catch (err) {
    console.error("Error writing script file:", err);
  }
};
