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


module.exports.SearchSite=async(req,res)=>{
    try {
        let qeury=req.body.query;
        let sites=await FrontendModel.find({$or:[{fname:{$regex:new RegExp(qeury,'i')}}]});

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


module.exports.AllSites=async(req,res)=>{
    try {

        const page = req.body.page || 1;
        const pageSize = req.body.pageSize;

        const skip = (page - 1) * pageSize;

        let filters=req.body.filters;




        let sites,totalCount;
        if(filters.isRunning){
            totalCount=await FrontendModel.countDocuments({Status:1});
            sites=await FrontendModel.find({Status:1}).skip(skip).limit(pageSize);
        }
        else if(filters.isStopped){
            totalCount=await FrontendModel.countDocuments({Status:0});
            sites=await FrontendModel.find({Status:0}).skip(skip).limit(pageSize);
        }
        else{
            totalCount=await FrontendModel.countDocuments();
            sites=await FrontendModel.find().skip(skip).limit(pageSize);
        }

        let totalPages=Math.ceil(totalCount / pageSize);

        res.json({
            status:true,
            sites:sites,
            totalPages:totalPages,
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
}

