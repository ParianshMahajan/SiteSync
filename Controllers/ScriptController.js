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

    file_pathfname="/etc/nginx/sites-enabled/${fname}"

    # Uncomment the lines starting with '#server_name' and '#root'
    sudo sed -i '/^\\s*#\\s*server_name/s/^\\s*#\\s*//' "$file_path"
    sudo sed -i '/^\\s*#\\s*root/s/^\\s*#\\s*//' "$file_path"

    echo "Server name line commented out successfully."

    # Check if the file was created successfully
    if [ $? -ne 0 ]; then
        echo "Error unCommenting lines."
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

module.exports.stopScript = async function stopScript(fpath, fname) {
  let content = `
    #!/bin/bash

    file_pathfname="/etc/nginx/sites-enabled/${fname}"

    # Comment out the lines starting with 'server_name' and 'root'
    sudo sed -i '/^\\s*server_name/s/^/#/' "$file_path"
    sudo sed -i '/^\\s*root/s/^/#/' "$file_path"

    echo "Server name line commented successfully."

    # Check if the lines are commented successfully
    if [ $? -ne 0 ]; then
        echo "Error commenting lines."
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

module.exports.deleteScript = async function deleteScript(fpath, fname) {
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

module.exports.renameScript = async function renameScript(fpath) {
    let content = `
      #!/bin/bash
  
      oldFname=\$1
      newFname=\$2
      
      old_conf_path="/etc/nginx/sites-enabled/\$oldFname"
      new_conf_path="/etc/nginx/sites-enabled/\$newFname"
      scripts_path="${process.env.VMPath}/\${oldFname}"
      
      # Rename the configuration file
      if [ -f "\$old_conf_path" ]; then
          sudo mv "\$old_conf_path" "\$new_conf_path"
      
          # Check if renaming was successful
          if [ $? -ne 0 ]; then
              echo "Error renaming conf file."
              exit 1
          fi
      
          echo "Configuration file renamed successfully."
      else
          echo "Old configuration file does not exist."
          exit 1
      fi
      
      # Update server_name and root in the new configuration file
      sudo sed -i "s/server_name .*;/server_name \${newFname}.pariansh.tech;/g" "\$new_conf_path"
      sudo sed -i "s|root .*;|root /home/paria/frontend/\${newFname};|g" "\$new_conf_path"
      
      # Check if the sed commands were successful
      if [ $? -ne 0 ]; then
          echo "Error updating configuration file."
          exit 1
      fi
      
      echo "Configuration file updated successfully."
      
      # Update the scripts with the new fname
      for script in start.sh stop.sh; do
          script_path="\$scripts_path/\$script"
          sudo sed -i "s|/etc/nginx/sites-enabled/.*|/etc/nginx/sites-enabled/\${newFname}|g" "\$script_path"
      done
      
      delete_script_path="\$scripts_path/delete.sh"
      sudo sed -i "s|sudo rm /etc/nginx/sites-enabled/.*|sudo rm /etc/nginx/sites-enabled/\${newFname}|g" "\$delete_script_path"
      
      # Check if the sed commands were successful
      if [ $? -ne 0 ]; then
          echo "Error updating scripts."
          exit 1
      fi
      
      echo "Scripts updated successfully."
      
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
