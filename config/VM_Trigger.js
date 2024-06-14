const { Client } = require('ssh2');

const connSettings = {
  host: process.env.VMip,
  port: 22,
  username: process.env.VMUserName,
  password: process.env.VMPassword
};

const conn = new Client();

module.exports.triggerScript = async (fname, status, newFname) => {
  return new Promise((resolve, reject) => {
    try {
      let sc = "";
      let scriptArgs = ""; // Initialize script arguments variable
      if (status === 20) {
        sc = "create.sh";
      } else if (status === 0) {
        sc = "stop.sh";
      } else if (status === 1) {
        sc = "start.sh";
      } else if (status === -1) {
        sc = "delete.sh";
      } else if (status === 40) {
        sc = "update.sh";
      } else if (status === 100) {
        sc = "rename.sh";
        scriptArgs = ` ${fname} ${newFname}`;
      } else {
        reject(new Error("Invalid status code"));
        return false;
      }

      const scriptPath = `${process.env.VMPath}/${fname}/${sc}`;
      conn.on('ready', () => {
        console.log('SSH Connection Established');

        conn.exec(`echo ${process.env.VMPassword} | sudo -S bash ${scriptPath}${scriptArgs}`, (err, stream) => {
          if (err) {
            reject(err);
            return false;
          }

          stream.on('close', (code, signal) => {
            console.log(`Script execution ended with code ${code}`);
            conn.end();
            resolve(true);
          }).on('data', (data) => {
            console.log(`STDOUT: ${data}`);
          }).stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`);
            reject(new Error(data.toString()));
          });
        });
      });

      conn.on('error', (err) => {
        reject(err);
      });
      
      conn.connect(connSettings);

    } catch (error) {
      reject(error);
      return false;
    }
  });
};
