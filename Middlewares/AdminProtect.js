const jwt=require('jsonwebtoken');
const ADMIN_USERNAME=process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD;
const Secret_key=process.env.Secret_key;


module.exports.isAdmin=async(req,res,next)=>{
    try {
        let token=req.body.token;
        if(token){
            let payload=jwt.verify(token,Secret_key);
            if(payload.UserName===ADMIN_USERNAME && 
                payload.Password===ADMIN_PASSWORD){
                
                    next();
            }
            else{
                throw new Error("Invalid Credentials");
            }
        }
        else{
            throw new Error("Invalid Token");
        }
    
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
};
