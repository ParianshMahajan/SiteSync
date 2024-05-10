const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const decompress = require("decompress");
const zlib = require('zlib');


const axios = require("axios");
const {
  createScript,
  startScript,
  stopScript,
  deleteScript,
} = require("./ScriptController");
const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { createDns } = require("./CloudflareController");

let url = `https://api.cloudflare.com/client/v4/zones/${process.env.zone_id}/dns_records`;
let headers = {
  Authorization: `Bearer ${process.env.api_token}`,
  "Content-Type": "application/json",
};

const uploadDir = path.join(__dirname, "../uploads");

module.exports.UploadZip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.json({
        message: "No file was uploaded.",
        status: false,
      });

      throw new Error("No file Uploaded");
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.ProcessZip = async (req, res) => {
  try {
    const jsonData = JSON.parse(req.body.data);
    const fname = jsonData.fname;
    const framework = jsonData.framework;

    // //Creating dns
    // let dnsResult=await createDns(fname);
    // console.log(dnsResult);
    // if(dnsResult==false){
    //   return res.json({
    //     message:'DNS Creation Failed',
    //     status:false
    //   });
    //   throw new Error('DNS Creation Failed');
    // }

    // Extracting Files
    const extractionDir = path.join(uploadDir, fname);
    fs.mkdirSync(extractionDir, { recursive: true });

    const zipFilePath = req.file.path;
    console.log(zipFilePath);
    // await decompress(zipFilePath, extractionDir)
    //   .catch((error) => {
    //     console.log(error);
    //   });

    const zipFileStream = fs.createReadStream(zipFilePath);


    // Pipe the zip file stream to zlib's createUnzip to decompress it
    zipFileStream.pipe(zlib.createUnzip())
      .on('error', (err) => {
        console.error('Error decompressing zip file:', err);
        res.status(500).json({ error: 'Failed to decompress zip file' });
      })
      .pipe(fs.createWriteStream(extractionDir))
      .on('error', (err) => {
        console.error('Error writing extracted files:', err);
        res.status(500).json({ error: 'Failed to write extracted files' });
      })
      .on('finish', () => {
        console.log('Zip file decompressed successfully');
        res.status(200).json({ message: 'Zip file decompressed successfully' });
      });




    // // Creating Scripts
    // createScript(path.join(extractionDir, 'create.sh'),fname,dnsResult.name,framework);
    // startScript(path.join(extractionDir, 'start.sh'),fname);
    // stopScript(path.join(extractionDir, 'stop.sh'),fname);
    // deleteScript(path.join(extractionDir, 'delete.sh'),fname);

    // let siteData={
    //     SiteDNS:dnsResult.name,
    //     DNSId:dnsResult.id,
    //     fname:fname,
    //     fpath:extractionDir
    // }

    // let site=await FrontendModel.create(siteData);
    // triggerScript(fname,20);

    res.json({
      message: "File Uploaded Successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
