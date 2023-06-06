const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const UserModelSchema = new mongoose.Schema({
    Uid: {
        type: String,
        default: uuidv4
    },
    Username: {
        type: String,
        required: true
    },
    Gmail: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Refreshtoken: {
        type: String,
        // default:""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    ProfileImage: {
        type: String
    },
    likedProjects:
        [
            {
                _id:
                {
                    type: String
                }
            }
        ],
    dislikedProjects:
        [
            {
                _id:
                {
                    type: String
                }
            }
        ],
    SavedProjects: [
        {
            Project_id: {
                type: String
            }
        },
    ],
    Followers: [
        {
            User_id: {
                type: String,
            },
            Date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    Following: [
        {
            User_id: {
                type: String,
            },
            Date: {
                type: Date,
                default: Date.now
            }
        }
    ]

})
UserModelSchema.methods.increaseCount = async function (_id) {
    try {
        // console.log(_id)
        var new_people = { _id: _id };

        this.likedProjects.push(new_people);
        await this.save();

        return this.likedProjects;

    } catch (error) {
        console.log(error);
    }
}
UserModelSchema.methods.decreaseCount = async function (_id) {
    try {   
        this.likedProjects=this.likedProjects.filter(ele=>ele._id!==_id)
        // console.log(this.likedProjects,"like Projects waala scene hai ")
        await this.save();
        return this.likedProjects;
    } catch (error) {
        console.log(error);
    }

}
UserModelSchema.methods.handleSave = async function (_id) {
    try {
        let new_saved = { Project_id: _id };
        this.SavedProjects.push(new_saved);
        await this.save();
        return this.SavedProjects;
    } catch (error) {
        console.log(error)
    }
}
UserModelSchema.methods.handleUnSave = async function (_id) {
    try {
        // let new_saved={Project_id:_id};
        this.SavedProjects = this.SavedProjects.filter(ele => ele.Project_id !== _id);
        await this.save();
        return this.SavedProjects;
    } catch (error) {
        console.log(error)
    }
}
UserModelSchema.methods.handleFollowers=async function(_id){
    try{

        const new_follower=
        {
            User_id:_id
        }
        this.Followers.push(new_follower);
        await this.save();
        return this.Followers;
    }
    catch(err){
        console.log("error while handleFollowers",err);
    }
}
UserModelSchema.methods.handleUnFollowers=async function(_id){
    try{
    this.Followers=this.Followers.filter(item=>item.User_id!==_id);
    await this.save();
    return this.Followers;
    }
    catch(err){
        console.log("Unfollowers time error",err);
    }
}


UserModelSchema.methods.handleFollowing=async function(_id){
    try{
        const new_following={
            User_id:_id
        }
        this.Following.push(new_following);
        await this.save();
        return this.Following;
    }
    catch(err){
        console.log("error while handleFollowers",err);
    }

}
UserModelSchema.methods.handleUnFollowing=async(_id)=>{
    try{
        this.Following=this.Following.filter(item=>item.User_id!==_id);
        this.save();
        return this.Following
    }catch(err){
        console.log("UnFollowing err",err)
    }
}


const UserModel = new mongoose.model('UserDetails', UserModelSchema);

module.exports = UserModel;