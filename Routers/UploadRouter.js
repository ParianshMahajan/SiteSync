const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); 


const { UploadZip, ProcessZip, ReplaceZip, isAvailable } = require('../Controllers/UploadController');

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

UploadRouter
.route('/replace')
.post(upload.single('file'),UploadZip,ReplaceZip);

UploadRouter
.route('/isavailable')
.post(isAvailable)

module.exports = UploadRouter;
