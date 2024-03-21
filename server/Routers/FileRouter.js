const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const axios = require('axios');
const { createScript, startScript, stopScript } = require('../Controllers/ScriptController');

const app = express();
const FileRouter = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  }
});





let url = `https://api.cloudflare.com/client/v4/zones/${process.env.zone_id}/dns_records`;
let headers = {
    'Authorization': `Bearer ${process.env.api_token}`,
    'Content-Type': 'application/json'
}



FileRouter
.route('/upload')
.post(upload.single('file'), async(req, res) => {
    if (!req.file) {
      return res.status(400).send('No file was uploaded.');
    }

    // Extracting JSON data 

    const jsonData = JSON.parse(req.body.data);
    const  fname = jsonData.fname;


    //Creating dns

    let data = {
        'type': "A",
        'name': fname,
        'content': "98.70.78.59",
        'proxied': true
    }

    
    let response = await axios.post(url, data, { headers: headers });
    if (response.status === 200)
        console.log("DNS record added successfully.",response.data.result.name)
    else
        console.log("Failed to add DNS record:", response.data);


    // Extracting Files

    const extractionDir = path.join(uploadDir, fname);
    fs.mkdirSync(extractionDir, { recursive: true });

    const zipFilePath = req.file.path;

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fileName = entry.path;
        const destinationPath = path.join(extractionDir, fileName);

        if (entry.type === 'Directory') {
          fs.mkdirSync(destinationPath, { recursive: true });
        } else {
          entry.pipe(fs.createWriteStream(destinationPath));
        }
      })
      .on('error', (error) => {
        console.error('Error extracting zip file:', error);
        res.status(500).send('Error extracting zip file.');
      })
      .on('finish', () => {
        console.log('Zip file extracted successfully.');
        res.send('Files uploaded and extracted successfully.');
      });


    //   Adding Scripts

      createScript(fname,response.data.result.name,path.join(extractionDir, 'create.sh'));
      startScript(fname,response.data.result.name,path.join(extractionDir, 'create.sh'));
      stopScript(fname,response.data.result.name,path.join(extractionDir, 'create.sh'));


  });



module.exports = FileRouter;
