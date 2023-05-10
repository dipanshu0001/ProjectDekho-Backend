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
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    ProfileImage:{
        type:String
    },
    likedProjects:
    [
        {
            _id:
            {
                type:String
            }
        }
    ],
    dislikedProjects:
    [
        {
            _id:
            {
                type:String
            }
        }       
    ],
    
})
UserModelSchema.methods.increaseCount=async function(_id){
    try{
        console.log(_id)
        var new_people = { _id: _id };
     
        this.likedProjects.push(new_people);
       
        
        await this.save();
        
        return this.likedProjects;
  
    }catch(error){
        console.log(error);
    }
  
}
UserModelSchema.methods.decreaseCount=async function(_id){
    try{
        var new_people = { _id: _id };
       
        this.dislikedProjects.push(new_people);
        
        await this.save();
        return this.dislikedProjects;
  
    }catch(error){
        console.log(error);
    }
  
  }
const UserModel=new mongoose.model('UserDetails',UserModelSchema);

module.exports=UserModel;