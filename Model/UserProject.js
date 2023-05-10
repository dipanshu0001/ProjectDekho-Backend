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
    timestamp:
    {
        type:Date,
        default:Date.now()
    },
    like:
    {
        type:Number,
        default:0
    },
    dislike:
    {
        type:Number,
        default:0
    },
    Industry:{
        type:String
    },
    Monetized:{
        type:String
    },
    Build:{
        type:String
    },
    Minprice:{
        type:String
    },
    Maxprice:{
        type:String
    },
    
    likePeople:
    [
        {
            Uid:
            {
                type:String
            },
            username:
            {
                type:String
            }
        }
    ],
    dislikePeople:
    [
        {
            Uid:
            {
                type:String
            },
            username:
            {
                type:String
            }
        }
    ],
    comments:
    [
        {
            Uid:
            {
                type:String
            },
            comment:
            {
                type:String
            },
            Timestamp:
            {
                type:Date,
                default:Date.now()
            }      
        }
    ]
})
ProjectSchema.methods.comment_handle=async function(_id,comment){
    try{
        var new_comment = { Uid: _id, comment: comment };
       
        this.comments.push(new_comment);
       
        await this.save();
        return this.comments;
  
    }catch(error){
        console.log(error);
    }
  
}
ProjectSchema.methods.increaseCount=async function(_id,username){
    try{
        var new_people = { Uid: _id, username: username };
       
        this.likePeople.push(new_people);
        this.like = this.like+1;
        await this.save();
        return this.like;
  
    }catch(error){
        console.log(error);
    }
  
}
ProjectSchema.methods.decreaseCount=async function(_id,username){
    try{
        var new_people = { Uid: _id, username: username };
       
        this.dislikePeople.push(new_people);
        this.dislike = this.dislike+1;
        await this.save();
        return this.like;
  
    }catch(error){
        console.log(error);
    }
  
  }
const ProjectModel=new mongoose.model("PorjectDetails",ProjectSchema);

module.exports=ProjectModel;