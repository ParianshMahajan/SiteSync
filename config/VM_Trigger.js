const { Client } = require('ssh2');

const connSettings = {
  host: process.env.VMip,
  port: 22,
  username: process.env.VMUserName,
  password: process.env.VMPassword
};

const conn = new Client();

module.exports.triggerScript = (fname, status, newFname) => {
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
        return reject(new Error("Invalid status code"));
      }

      const scriptPath = `${process.env.VMPath}/${fname}/scipts/${sc}`;
      conn.on('ready', () => {
        console.log('SSH Connection Established');

        conn.exec(`echo ${process.env.VMPassword} | sudo -S bash ${scriptPath}${scriptArgs}`, (err, stream) => {
          if (err) {
            return reject(err);
          }

          stream.on('close', (code, signal) => {
            console.log(`Script execution ended with code ${code}`);
            conn.end();
            if (code === 0) {
              resolve(true);
            } else {
              reject(new Error(`Script ended with non-zero exit code: ${code}`));
            }
          }).on('data', (data) => {
            console.log(`STDOUT: ${data}`);
          }).stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`);
          });
        });
      });

      conn.on('error', (err) => {
        reject(err);
      });

      conn.connect(connSettings);

    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
}
