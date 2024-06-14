const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { deleteDns, createDns } = require("./CloudflareController");
const fs = require("fs");

module.exports.StopSite = async function StopSite(req, res) {
    try {
        let site = await FrontendModel.findOne(req.body.id);
        if(site.Status == 1){
            site.Status = 0;
            if(triggerScript(site.fname, 0)===false){
                throw new Error("Script Execution Failed")
            }
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
        let site = await FrontendModel.findOne(req.body.id);
        if(site.Status == 0){
            site.Status = 1;
            if(triggerScript(site.fname, 1)===false){
                throw new Error("Script Execution Failed")
            }
            await site.save();
        }
        else{
            throw new Error("Site Already Running");
        }
            
        res.json({
            message: "Site Started",
            status:true
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
} 



module.exports.DeleteSite = async function DeleteSite(req, res) {
    try {
        let site = await FrontendModel.findOne(req.body.id);
        if(await deleteDns(site.DNSId)){
            if(!triggerScript(site.fname, -1)){
                throw new Error("Script Execution Failed")
            }
            fs.rmdirSync(site.fpath, { recursive: true });   
            await site.remove();
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
        const newFname = req.body.fname;
        let site = await FrontendModel.findOne(req.body.id);
        let oldDnsId = site.DNSId;
        let dnsResult=await createDns(fname);
        console.log(dnsResult);
        
        if(dnsResult!=false){

            site.DNSId = dnsResult.id;
            site.SiteDNS = dnsResult.name;


            if(!triggerScript(site.fname, 100, newFname)){
                throw new Error("Script Execution Failed")
            }

            const newFolderPath = path.join(path.dirname(site.fpath), newFname);
            fs.renameSync(oldFolderPath, newFolderPath);

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
