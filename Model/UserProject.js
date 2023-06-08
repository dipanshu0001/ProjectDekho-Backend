const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const ProjectSchema = new mongoose.Schema({
    Uid: {
        type: String,
        // default: uuidv4
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
    Contact: {
        type: String,
        required: true,
    },
    Deployed_link: {
        type: String,
        // required: true,
    },
    Github_node: {
        type: String
    },
    Image: {
        type: String,
        // required: true,
    },
    isFullStack: {
        type: Boolean,
        default: false
    },
    timestamp:
    {
        type: Date,
        default: Date.now()
    },
    like:
    {
        type: Number,
        default: 0
    },
    dislike:
    {
        type: Number,
        default: 0
    },
    Vieweduser: 
    [
        {

            Uid:
            {
                type: String
            },
            Timestamp:
            {
                type: Date,
                default: Date.now()
            }
        }
    ],
    Industry: {
        type: String
    },
    Monetized: {
        type: Boolean,
        default:false
    },
    Build: {
        type: Number
    },
    Minprice: {
        type: Number
    },
    Maxprice: {
        type: Number
    },

    likePeople:
        [
            {
                Uid:
                {
                    type: String,
                    unique:true
                },
                username:
                {
                    type: String
                }
            }
        ],
    dislikePeople:
        [
            {
                Uid:
                {
                    type: String
                },
                username:
                {
                    type: String
                }
            }
        ],
    comments:
        [
            {
                Uid:
                {
                    type: String
                },
                comment:
                {
                    type: String
                },
                Timestamp:
                {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
})
ProjectSchema.methods.comment_handle = async function (_id, comment) {
    try {
        var new_comment = { Uid: _id, comment: comment };

        this.comments.push(new_comment);

        await this.save();
        return this.comments;

    } catch (error) {
        console.log(error);
    }

}

ProjectSchema.methods.increaseCount = async function (_id, username) {
    try {
        var new_people = { Uid: _id, username: username };

        this.likePeople.push(new_people);
        // this.like = this.like+1;
        await this.save();
        return this.likePeople;

    } catch (error) {
        console.log(error);
    }
}
ProjectSchema.methods.decreaseCount = async function (_id, username) {
    try {
        // var new_people = { Uid: _id, username: username };
        const new_like = [];
        // likePeople=this.likePeople.filter(ele=>ele.Uid!==_id)
        this.likePeople.forEach((ele) => {
            if (ele.Uid !== _id) {
                new_like.push(ele);
            }
        })
        // console.log(new_like)
        this.likePeople = new_like
        // this.dislike = this.dislike+1;
        await this.save();
        return new_like;

    } catch (error) {
        console.log(error);
    }

}
ProjectSchema.methods.addNewViewer=async function(uid){
    try{
        this.Vieweduser.push({Uid:uid});
        await this.save();
        return this.Vieweduser
    }catch(err){
        console.log(err.message);
    }
}


const ProjectModel = new mongoose.model("PorjectDetails", ProjectSchema);

module.exports = ProjectModel;