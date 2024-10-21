const { Client } = require("ssh2");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const AdminModel = require("../Models/AdminModel");

const connSettings = {
  host: process.env.VMip,
  port: 22,
  username: process.env.VMUserName,
  password: process.env.VMPassword,
};

module.exports.triggerScript = (scriptPath, scriptArgs) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      // Execute script on established SSH connection
      conn.exec(
        `echo ${process.env.VMPassword} | sudo -S bash ${scriptPath} ${scriptArgs}`,
        (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          stream
            .on("close", (code, signal) => {
              console.log(`Script execution ended with code ${code}`);
              conn.end();
              if (code === 0) {
                resolve(true);
              } else {
                reject(
                  new Error(`Script ended with non-zero exit code: ${code}`)
                );
              }
            })
            .on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              console.error(`STDERR: ${data}`);
            });
        }
      );
    });

    conn.on("error", (err) => {
      console.error("SSH Connection Error:", err);
      reject(err);
      conn.end();
    });

    conn.connect(connSettings);
  });
};












module.exports.checkPortAvailability = (port) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("SSH connection established.");

      // Command to check if the port is listening on the IP
      const checkPortCmd = `netstat -tuln | grep :${port}`;

      conn.exec(checkPortCmd, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }

        let stdout = "";
        let stderr = "";

        stream
          .on("data", (data) => {
            stdout += data;
          })
          .stderr.on("data", (data) => {
            stderr += data;
          });

        stream.on("close", (code) => {
          console.log(`Command execution ended with code ${code}`);
          conn.end();

          if (code === 0 && stdout.trim()) {
            resolve({
              status: false,
              message: `Port ${port} is running.`,
            });
          } else {
            resolve({
              status: true,
              message: `Port ${port} is not running.`,
            });
          }
        });
      });
    });

    conn.on("error", (err) => {
      console.error("SSH Connection Error:", err);
      reject(err);
      conn.end();
    });

    conn.connect(connSettings);
  });
};





module.exports.streamContainerLogs = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      let payload = jwt.verify(token, process.env.Secret_key);

      if (payload) {
        let user = await AdminModel.findOne({ username: payload.username });

        if (user) {
          if (user.password === payload.password) {
            console.log(user);
            next();
          } else {
            throw new Error("Invalid Password");
          }
        } else {
          throw new Error("User does not exist.");
        }
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      return;
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected to WebSocket.");

    socket.on("start-logs", async (data) => {
      const { port } = data;

      try {
        const conn = new Client();

        conn.on("ready", () => {
          console.log("SSH connection established.");

          const findContainerCmd = `sudo docker ps --filter "publish=${port}" --format "{{.ID}}"`;

          conn.exec(
            `echo ${process.env.VMPassword} | ${findContainerCmd}`,
            (err, stream) => {
              if (err) {
                conn.end();
                socket.emit("log", `Error: ${err.message}`);
                return;
              }

              let containerId = "";

              stream.on("data", (data) => {
                containerId += data.toString().trim();
              });

              stream.on("close", () => {
                if (containerId) {
                  console.log(`Container ID for port ${port}: ${containerId}`);

                  const logCmd = `echo ${process.env.VMPassword} | sudo docker logs -f ${containerId}`;

                  conn.exec(logCmd, (err, logStream) => {
                    if (err) {
                      conn.end();
                      socket.emit("log", `Error: ${err.message}`);
                      return;
                    }

                    logStream.on("data", (data) => {
                      const rawLog = data.toString().trim();
                      // const formattedLog = formatLog(rawLog);
                      socket.emit("log", rawLog);
                    });

                    logStream.on("close", () => {
                      console.log("Log stream closed.");
                      conn.end();
                    });

                    socket.on("disconnect", () => {
                      console.log("Client disconnected, stopping log stream.");
                      logStream.destroy();
                      conn.end();
                    });
                  });
                } else {
                  socket.emit("log", `No container found for port ${port}.`);
                  conn.end();
                }
              });
            }
          );
        });

        conn.on("error", (err) => {
          console.error("SSH Connection Error:", err);
          socket.emit("log", `SSH Connection Error: ${err.message}`);
          conn.end();
        });

        conn.connect(connSettings);
      } catch (error) {
        console.error("Error:", error.message);
        socket.emit("log", `Error: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from WebSocket.");
    });
  });
};
