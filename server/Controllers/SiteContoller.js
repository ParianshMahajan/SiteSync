const FrontendModel = require("../Models/FrontendModel");
const { triggerScript } = require("../config/VM_Trigger");
const { deleteDns } = require("./CloudflareController");

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
        res.json({
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
        res.json({
            message:error.message,
            status:false
        })
    }
} 



module.exports.DeleteSite = async function DeleteSite(req, res) {
    try {
        let site = await FrontendModel.findOne(req.body.id);
        if(await deleteDns(site.DNSId)){
            if(triggerScript(site.fname, -1===false)){
                throw new Error("Script Execution Failed")
            }
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
        res.json({
            message:error.message,
            status:false
        })
    }
} 