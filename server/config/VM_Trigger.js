const { Client } = require('ssh2');

const connSettings = {
  host: process.env.VMip,
  port: 22,
  username: process.env.VMUserName,
  password: process.env.VMPassword
};

const conn = new Client();

module.exports.triggerScript = (fname, status) => {
  let sc = "";
  if (status === 0) {
    sc = "create.sh";
  }
  if (status === 1) {
    sc = "start.sh";
  }
  if (status === -1) {
    sc = "down.sh";
  }

  const scriptPath = `${process.env.VMPath}/${fname}/${sc}`;
  conn.on('ready', () => {
    console.log('SSH Connection Established');

    // Modified exec command to use sudo with -S option
    conn.exec(`echo ${process.env.VMPassword} | sudo -S bash ${scriptPath}`, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Script execution ended with code ${code}`);
        conn.end();
      }).on('data', (data) => {
        console.log(`STDOUT: ${data}`);
      }).stderr.on('data', (data) => {
        console.error(`STDERR: ${data}`);
      });
    });
  });

  conn.connect(connSettings);
};
