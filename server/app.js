const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

var cors = require('cors');
app.use(cors());

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

//app.use((req, res, next) => {
  // Set timeout to 0 to disable it (or set it to a higher value in milliseconds)
//  req.setTimeout(0);
//  res.setTimeout(0);
//  next();
//});

const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(uploadDir, file.originalname);
    const dirname = path.dirname(filePath);
    fs.mkdirSync(dirname, { recursive: true });
    cb(null, dirname);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});



const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB, adjust as needed
  }
});


app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  const zipFilePath = req.file.path;
  const destinationFolder = path.join(__dirname, 'uploads');

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  const zipStream = fs.createReadStream(zipFilePath);

  zipStream.pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const fileName = entry.path;
      const destinationPath = path.join(destinationFolder, fileName);

      const existingFolder = path.join(destinationFolder, fileName);
      if (fs.existsSync(existingFolder)) {
        fs.rmSync(existingFolder, { recursive: true, force: true });
      }

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
    .on('close', () => {
      console.log('Zip file extracted successfully.');
      res.send('Files uploaded and extracted successfully.');
    });
});

let port = process.env.PORT || 2123;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


