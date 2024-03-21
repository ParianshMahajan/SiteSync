const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const db = require('./config/MongoConfig.js')



var cors = require('cors');
app.use(cors());

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


const FileRouter = require('./Routers/FileRouter.js');






let port = process.env.PORT || 2123;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

startRoutes();

function startRoutes(){
  app.use('/api',FileRouter);
}