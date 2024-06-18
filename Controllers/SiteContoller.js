const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { deleteDns, createDns } = require("./CloudflareController");
const path = require("path");
const fs = require("fs");

module.exports.StopSite = async function StopSite(req, res) {
    try {
        let site = await FrontendModel.findById(req.body.id);
        if(site.Status == 1){
            const scriptResult = await triggerScript(site.fname, 0);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            site.Status = 0;
            await site.save();
        }
        else{
            throw new Error("Site Already Stopped");
        }
            
        res.json({
            message: "Site Stopped",
            status:true
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
} 


module.exports.StartSite = async function StartSite(req, res) {
    try {
        let site = await FrontendModel.findById(req.body.id);
        if(site.Status == 0){
            const scriptResult = await triggerScript(site.fname, 1);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            site.Status = 1;
            await site.save();
            res.json({
              message: "Site Started",
              status: true
            });

        } 
        else {
          throw new Error("Site Already Running");
        }
    

    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
} 



module.exports.DeleteSite = async function DeleteSite(req, res) {
    try {
        let site = await FrontendModel.findById(req.body.id);
        if(await deleteDns(site.DNSId)){
            const scriptResult = await triggerScript(site.fname, -1);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            fs.rmdirSync(site.fpath, { recursive: true });   
            await FrontendModel.deleteOne({_id:site._id});
        }
        else{
            throw new Error("Failed to delete DNS");
        }
            
        res.json({
            message: "Site Deleted",
            status:true
        }); 

        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
} 


module.exports.RenameSite = async function RenameSite(req, res) {
    try {
        console.log(req.body);
        const newFname = req.body.fname;
        let site = await FrontendModel.findById(req.body.id);
        let oldDnsId = site.DNSId;
        let dnsResult=await createDns(newFname);
        console.log(dnsResult);
        
        if(dnsResult!=false){

            
            
            const scriptResult = await triggerScript(site.fname, 100, newFname);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            
            const newFolderPath = path.join(path.dirname(site.fpath), newFname);
            fs.renameSync(oldFolderPath, newFolderPath);
            
            site.DNSId = dnsResult.id;
            site.SiteDNS = dnsResult.name;
            site.fname = newFname;
            site.fpath = newFolderPath;
            await site.save();
        }
        else{
            throw new Error("Failed to create DNS");
        }


        await deleteDns(oldDnsId);
            
        res.json({
            message: "Site Deleted",
            status:true
        }); 
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
} 
