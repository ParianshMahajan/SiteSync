const { Client } = require('ssh2');

const connSettings = {
  host: process.env.VMip,
  port: 22,
  username: process.env.VMUserName,
  password: process.env.VMPassword
};

const conn = new Client();

module.exports.triggerScript = async (fname, status) => {
  return new Promise((resolve, reject) => {
    try {
      let sc = "";
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
      } else {
        reject(new Error("Invalid status code"));
        return;
      }

      const scriptPath = `${process.env.VMPath}/${fname}/${sc}`;
      conn.on('ready', () => {
        console.log('SSH Connection Established');

        // Modified exec command to use sudo with -S option
        conn.exec(`echo ${process.env.VMPassword} | sudo -S bash ${scriptPath}`, (err, stream) => {
          if (err) {
            reject(err);
            return;
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
    }
  });
};
