const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const FrontendSchema=new Schema({
    SiteDNS:{
        type:String
    },
    DNSId:{
        type:String
    },
    fname:{
        type:String
    },
    framework:{
        type:Boolean
    },
    Status:{
        type:Number,
        default:1
        // 0->stopped
        // 1->running
    },
    fpath:{
        type:String
    }
})

module.exports=mongoose.model("frontend",FrontendSchema);
