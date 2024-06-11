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
} = require("./ScriptController");
const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { createDns } = require("./CloudflareController");

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

    decompress(zipFilePath, extractionDir)



    // Creating Scripts
    createScript(path.join(extractionDir, 'create.sh'),fname,dnsResult.name,framework);
    startScript(path.join(extractionDir, 'start.sh'),fname);
    stopScript(path.join(extractionDir, 'stop.sh'),fname);
    deleteScript(path.join(extractionDir, 'delete.sh'),fname);
    
    let siteData={
        SiteDNS:dnsResult.name,
        DNSId:dnsResult.id,
        fname:fname,
        framework:framework,
        fpath:extractionDir
    }
    
    let site=await FrontendModel.create(siteData);
    triggerScript(fname,20);
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
    const framework = site.framework;


    
    
    // Extracting Files
    const extractionDir = path.join(uploadDir, fname);
    fs.rmdirSync(extractionDir, { recursive: true });
    fs.mkdirSync(extractionDir, { recursive: true });

    const zipFilePath = req.file.path;

    decompress(zipFilePath, extractionDir)



    createScript(path.join(extractionDir, 'create.sh'),fname,dnsResult.name,framework);
    startScript(path.join(extractionDir, 'start.sh'),fname);
    stopScript(path.join(extractionDir, 'stop.sh'),fname);
    deleteScript(path.join(extractionDir, 'delete.sh'),fname);
    updateScript(path.join(extractionDir, 'update.sh'),fname);


    
    triggerScript(fname,40);
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
