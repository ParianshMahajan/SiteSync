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


const UploadRouter = require('./Routers/UploadRouter.js');
const SiteRouter = require('./Routers/SiteRouter.js');
const AdminRouter = require('./Routers/AdminRouter.js');


startRoutes();


let port = process.env.PORT || 2123;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


function startRoutes(){
  app.use('/upload',UploadRouter);
  app.use('/site',SiteRouter);
  app.use('/',AdminRouter);
}