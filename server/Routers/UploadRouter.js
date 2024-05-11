const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
    const ext = path.extname(file.originalname);
    if (ext.toLowerCase() === '.zip') {
      cb(null, file.originalname); 
    } else {
      cb(null, file.originalname + '.zip'); 
    }
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  }
});




UploadRouter
.route('/')
.post(upload.single('file'),UploadZip,ProcessZip);



module.exports = UploadRouter;
