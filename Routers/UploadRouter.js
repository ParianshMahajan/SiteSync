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
const { UploadZip, ProcessZip } = require('../Controllers/UploadController');

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
.post(upload.single('file'),UploadZip,ProcessZip);



module.exports = UploadRouter;
