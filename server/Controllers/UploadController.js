const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const decompress = require('decompress');

const axios = require("axios");
const {
  createScript,
  startScript,
  stopScript,
  deleteScript,
  updateScript,
  renameScript,
} = require("./ScriptController");
const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { createDns, isRecordExists } = require("./CloudflareController");

const uploadDir = path.join(__dirname, "../uploads");



module.exports.UploadZip = async (req, res, next) => {
  try {
    if (!req.file) {
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

    //Creating dns
    let dnsResult=await createDns(fname);
    if(dnsResult==false){
      throw new Error('DNS Creation Failed');
    }

    // Extracting Files


    const extractionDir = path.join(uploadDir, fname);
    fs.mkdirSync(extractionDir, { recursive: true });
    const zipFilePath = req.file.path;
    decompress(zipFilePath, extractionDir)



    const scriptsDir = path.join(extractionDir, 'scripts');
    fs.mkdirSync(scriptsDir, { recursive: true });

    // Creating Scripts
    createScript(path.join(scriptsDir, 'create.sh'),fname,dnsResult.name,framework);
    startScript(path.join(scriptsDir, 'start.sh'),fname);
    stopScript(path.join(scriptsDir, 'stop.sh'),fname);
    deleteScript(path.join(scriptsDir, 'delete.sh'),fname);
    updateScript(path.join(scriptsDir, 'update.sh'));
    renameScript(path.join(scriptsDir, 'rename.sh'),fname);

    let siteData={
        SiteDNS:dnsResult.name,
        DNSId:dnsResult.id,
        fname:fname,
        framework:framework,
        fpath:extractionDir
    }
    
    let site=await FrontendModel.create(siteData);
    const scriptResult = await triggerScript(path.join(scriptsDir, 'create.sh'));
    if (scriptResult === false) {
        throw new Error("Script Execution Failed");
    }
    res.json({
      message: "Site Deployed Successfully",
      status: true,
      site:site.SiteDNS
    })
  } 
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports.ReplaceZip = async (req, res) => {
  try {
    const site = await FrontendModel.findOne(req.body.id);
    const fname = site.fname;
    const dns = site.SiteDNS;
    const framework = site.framework;


    
    
    // Extracting Files
    const extractionDir = path.join(uploadDir, fname);
    fs.rmdirSync(extractionDir, { recursive: true });
    fs.mkdirSync(extractionDir, { recursive: true });

    const zipFilePath = req.file.path;

    decompress(zipFilePath, extractionDir)


    const scriptsDir = path.join(extractionDir, 'scripts');
    fs.mkdirSync(scriptsDir, { recursive: true });

    // Creating Scripts
    createScript(path.join(scriptsDir, 'create.sh'),fname,dns,framework);
    startScript(path.join(scriptsDir, 'start.sh'),fname);
    stopScript(path.join(scriptsDir, 'stop.sh'),fname);
    deleteScript(path.join(scriptsDir, 'delete.sh'),fname);
    updateScript(path.join(scriptsDir, 'update.sh'));
    renameScript(path.join(scriptsDir, 'rename.sh'),fname);


    
    const scriptResult = await triggerScript(path.join(scriptsDir, 'update.sh'));
    if (scriptResult === false) {
        throw new Error("Script Execution Failed");
    }
    res.json({
      message: "File updated Successfully",
      status: true,
    })

    } catch (error) {
        res.status(500).json({
            message: error.message,
    });
  }
};


module.exports.isAvailable=async(req,res)=>{
  try {
      let site=await FrontendModel.findOne({fname:req.body.Name});
      if(site){
          throw new Error("Site is not Available");
      }
      else{
          if(await isRecordExists(req.body.Name)){
              throw new Error("DNS is not Available");
          }
          res.json({
              status:true,
              message:"Site is Available"
          });
      }
          
  } catch (error) {
      res.status(500).json({
          message:error.message,
          status:false
      })
  }
}
