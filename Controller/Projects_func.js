const projectModel = require('../Model/UserProject')
const userModel = require('../Model/UserModel')
const getAllProjects = async(req, res) => {
    try{
        const allProjects  =  await projectModel.find({});
        res.status(200).json(allProjects);
    }catch (error) {
         
        res.status(500).json({error:error.message})
    }
}

const like_count_handler=async(req,res)=>
{
    try {
        const id =  req.params.id
        const bool = req.params.check
        const userid = req.params.user
        console.log(bool)
        if(bool==="1")
        {
            
            const liked_project = await projectModel.findOne({_id:id})
            const finduser_who_liked_project = await userModel.findOne({Username:userid})
           
            const alllikedPeople = liked_project.likePeople;
            
            for (let index = 0; index < alllikedPeople.length; index++) {
                console.log(finduser_who_liked_project.Uid)
                if(finduser_who_liked_project.Uid === alllikedPeople[index].Uid)
                {
                    console.log("alreadyPresent")
                    return res.status(500).json("already liked ");
                }
                
            }
   
                await finduser_who_liked_project.increaseCount(liked_project._id)
                await finduser_who_liked_project.save();
                // console.log(finduser_who_liked_project)
                await liked_project.increaseCount(finduser_who_liked_project.Uid,finduser_who_liked_project.Username);
                await liked_project.save();
                
                res.status(200).json("Like count increased successfully")
            

            
        }else if(bool==="0")
        {
            const disliked_project = await projectModel.findOne({_id:id})
            const finduser_who_disliked_project = await userModel.findOne({Username:userid})
            const allldisikedPeople = disliked_project.dislikePeople;
           
            for (let index = 0; index < allldisikedPeople.length; index++) {
                console.log(finduser_who_disliked_project.Uid)
                if(finduser_who_disliked_project.Uid === allldisikedPeople[index].Uid)
                {
                    console.log("alreadyPresent")
                    return res.status(500).json("already disliked ");
                }
                
            }
                
                await finduser_who_disliked_project.decreaseCount(disliked_project._id)
                await finduser_who_disliked_project.save();
                await disliked_project.decreaseCount(finduser_who_disliked_project.Uid,finduser_who_disliked_project.Username);
                await disliked_project.save();
                
                res.status(200).json("dislike count increased successfully")
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

module.exports = { getAllProjects,like_count_handler }