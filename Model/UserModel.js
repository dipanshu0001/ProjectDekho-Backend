const mongoose = require('mongoose');
const {v4:uuidv4}=require('uuid'); 



const UserModelSchema=new mongoose.Schema({
    Uid:{
        type:String,
        default:uuidv4
    },
    Username:{
        type:String,
        required:true
    },
    Gmail:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Refreshtoken:{
        type:String,
        // default:""
    }
})
const UserModel=new mongoose.model('UserDetails',UserModelSchema);

module.exports=UserModel;