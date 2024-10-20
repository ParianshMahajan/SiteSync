const jwt=require('jsonwebtoken');
const FrontendModel = require('../Models/FrontendModel');
const AdminModel = require('../Models/AdminModel');
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
        console.log(data);
        if(data.username){
            let user=await AdminModel.findOne({username:data.username});
            if(user){
                if(user.password===data.password){
                    let payload={
                        username:data.username,
                        password:data.password
                    }
                    let token=jwt.sign(payload,Secret_key);
                    res.json({
                        access:token,
                        status:true
                    });
                }
                else{
                    throw new Error("Invalid Password");
                }
            }
            else{
                throw new Error("User does not exists.");
            }
        }
        else{
            throw new Error("Invalid Credentials");
        }
    } 
    catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
};



module.exports.updatePassword = async function updatePasswrord(req, res) {
    try {
        let data=req.body;
        let admin=await AdminModel.findOne({username:req.user.username});
        admin.password=data.password;
        await admin.save();
        let payload={
            username:admin.username,
            password:admin.password
        }
        let token=jwt.sign(payload,Secret_key);
        res.json({
            status:true,
            message:"Password Updated",
            access:token
        });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: false,
      });
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





const { checkPortAvailability } = require('../config/VM_Trigger');

module.exports.test = async function test(req, res) {
  try {
     
      const resp=await checkPortAvailability(4484);
      console.log(resp);    
      
      res.json({
        status: true,
      });

  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
