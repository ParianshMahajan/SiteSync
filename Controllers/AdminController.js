const jwt=require('jsonwebtoken');
const FrontendModel = require('../Models/FrontendModel');
const ADMIN_USERNAME=process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD;
const Secret_key=process.env.Secret_key;


module.exports.verifyLogIn = async function verifyLogIn(req, res) {
    try {
      res.json({
        status: true,
        message: "LOGGED IN",
      });
      
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: false,
      });
    }
  };
  
  


module.exports.createJWT=async(req,res)=>{
    try {
        let data=req.body;
        if(data.UserName===ADMIN_USERNAME && data.Password===ADMIN_PASSWORD){
            
            let payload={
                UserName:ADMIN_USERNAME,
                Password:ADMIN_PASSWORD,
            }

            let token=jwt.sign(payload,Secret_key);

            res.json({
                token:token,
                status:true
            });
        }
        else{
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
};


module.exports.AllSites=async(req,res)=>{
    try {
        let sites=await FrontendModel.find();

        res.json({
            status:true,
            sites:sites
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
}

