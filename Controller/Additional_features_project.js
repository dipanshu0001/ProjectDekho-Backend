const userModel =require('../Model/UserModel')
const projectModel=require('../Model/UserProject')

const getTopLiked=async(req,res)=>{
    try
    {
        const result=await projectModel.aggregate([
            {
                $project:
                {
                    likePeoplecount:{$size:"$likePeople"},
                    originalFields: "$$ROOT",
                    _id:0
                }
            },
            {
                $sort:{likePeoplecount:-1}
            },  
            {$limit:5},{
                $project:{
                    likePeoplecount:0,
                }
            }
        ])
        // const result=await ?projectModel.find({}).sort({likePeople:-1});
        res.status(200).send([...result]);
    }catch(err){
        console.log(err);
    }
}
module.exports={
    getTopLiked
}