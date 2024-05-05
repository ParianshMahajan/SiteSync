const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require("adm-zip");
const { exec } = require('child_process'); 


const axios = require('axios');
const { createScript, startScript, stopScript, deleteScript } = require('../Controllers/ScriptController');
const FrontendModel = require('../Models/FrontendModel');
const { triggerScript } = require('../config/VM_Trigger');
const { createDns } = require('../Controllers/CloudflareController');

const app = express();
const UploadRouter = express.Router();

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



UploadRouter
.route('/')
.post(upload.single('file'), async(req, res) => {
    try {

      
      if (!req.file) {
        
        return res.json({
          message:'No file was uploaded.',
          status:false
        });
        
        throw new Error('No file Uploaded');
        
      }

      // Extracting JSON data 

      const jsonData = JSON.parse(req.body.data);
      const  fname = jsonData.fname;
      const  framework = jsonData.framework;


      //Creating dns
      let dnsResult=await createDns(fname);
      console.log(dnsResult);
      if(dnsResult==false){
        return res.json({
          message:'DNS Creation Failed',
          status:false
        });
        throw new Error('DNS Creation Failed');
      }


      // Extracting Files

      const extractionDir = path.join(uploadDir, fname);
      fs.mkdirSync(extractionDir, { recursive: true });

      const zipFilePath = req.file.path;

      // const zip = new AdmZip(zipFilePath);
      // zip.extractAllTo(extractionDir);



      exec(`unzip ${zipFilePath} -d ${extractionDir}`);
      fs.unlink(zipFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting temporary file:", unlinkErr);
          }
        });

      //   Adding Scripts

        createScript(path.join(extractionDir, 'create.sh'),fname,dnsResult.name,framework);
        startScript(path.join(extractionDir, 'start.sh'),fname);
        stopScript(path.join(extractionDir, 'stop.sh'),fname);
        deleteScript(path.join(extractionDir, 'delete.sh'),fname);


        let siteData={
            SiteDNS:dnsResult.name,
            DNSId:dnsResult.id,
            fname:fname,
            fpath:extractionDir
        }

        let site=await FrontendModel.create(siteData);
        triggerScript(fname,20); 

        res.json({
          message: "Site Deployed Successfully",
          status:true
        });
      
      } catch (error) {
        res.json({
          message:error.message
        })
      }
  });



module.exports = UploadRouter;