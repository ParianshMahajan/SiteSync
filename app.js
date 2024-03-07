const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const https = require('https');


const server = https.createServer(app);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())





app.get('/', (req, res) => {
    res.json({
        message: 'Hi'
    });
});



  
let port=process.env.PORT;
  
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
