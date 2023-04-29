const mongoose = require('mongoose');
const {v4:uuidv4}=require('uuid');    


const ProjectSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4
    },
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Github_react: {
        type: String,
        required: true,
    },
    Contact:{
        type:String,
        required: true,
    },
    Deployed_link: {
        type: String,
        // required: true,
    },
    Github_node:{
        type:String
    },
    Image: {
        type: String,
        // required: true,
    },
    isFullStack:{
        type:Boolean,
        default:false
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
})
const ProjectModel=new mongoose.model("PorjectDetails",ProjectSchema);

module.exports=ProjectModel;