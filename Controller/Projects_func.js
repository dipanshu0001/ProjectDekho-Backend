const projectModel = require('../Model/UserProject')
const userModel = require('../Model/UserModel')
const getAllProjects = async (req, res) => {
    try {
        const allProjects = await projectModel.find({});
        res.status(200).json(allProjects);
    } catch (error) {

        res.status(500).json({ error: error.message })
    }
}
const comment_section_handler = async (req, res) => {
    try {
        const id = req.params.id
        const userid = req.params.user
        // console.log(id)
        // console.log(req.body)
        const projectDetails = await projectModel.findOne({ _id: id })
        const finduser_who_comment = await userModel.findOne({ Uid: userid })
        await projectDetails.comment_handle(finduser_who_comment.Uid, req.body.comment);
        await projectDetails.save();
        const result= await projectModel.findOne({ _id: id })
        res.status(200).json({new_comments:result.comments})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const like_count_handler = async (req, res) => {
    try {
        const id = req.params.id
        const bool = req.params.check
        const userid = req.params.user
        console.log(req.params)
        // console.log(typeof(bool));
        if (bool === "1") {
            console.log(bool)

            const liked_project = await projectModel.findOne({ _id: id })
            const finduser_who_liked_project = await userModel.findOne({ Uid: userid })
            // console.log(finduser_who_liked_project)
            const alllikedPeople = liked_project.likePeople;

            for (let index = 0; index < alllikedPeople.length; index++) {
                // console.log(finduser_who_liked_project.Uid)
                if (finduser_who_liked_project.Uid === alllikedPeople[index].Uid) {
                    console.log("alreadyPresent")
                    return res.status(500).json("already liked ");
                }

            }
            const dislikearray = liked_project.dislikePeople;
            const new_dislike = dislikearray.filter(ele => ele.Uid !== userid)
            const disliked = { dislikePeople: new_dislike }
            await projectModel.updateOne({ _id: id }, {dislikePeople: disliked }, { new: true })
            await finduser_who_liked_project.increaseCount(liked_project._id)
            await finduser_who_liked_project.save();
            // console.log(finduser_who_liked_project)
            await liked_project.increaseCount(finduser_who_liked_project.Uid, finduser_who_liked_project.Username);
            await liked_project.save();

            res.status(200).json("Like count increased successfully")



        } else if (bool === "0") {
            const disliked_project = await projectModel.findOne({ _id: id })
            const finduser_who_disliked_project = await userModel.findOne({ Uid: userid })
            const allldisikedPeople = disliked_project.dislikePeople;

            for (let index = 0; index < allldisikedPeople.length; index++) {
                console.log(finduser_who_disliked_project.Uid)
                if (finduser_who_disliked_project.Uid === allldisikedPeople[index].Uid) {
                    // console.log("alreadyPresent")
                    return res.status(500).json("already disliked ");
                }

            }
            const likearray = disliked_project.likePeople;
            // console.log(likearray);
            const new_like = likearray.filter(ele => ele.Uid !== userid)
            const liked = { likePeople: new_like }
            console.log(liked);
            await projectModel.updateOne({ _id: id }, { likePeople:liked }, { new: true })
            await finduser_who_disliked_project.decreaseCount(disliked_project._id)
            await finduser_who_disliked_project.save();
            await disliked_project.decreaseCount(finduser_who_disliked_project.Uid, finduser_who_disliked_project.Username);
            await disliked_project.save();

            res.status(200).json("dislike count increased successfully")
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const find_already_disliked = async (req, res) => {
    const { user_uid, _id } = req.body;
    // console.log(req.body,"called")
    // console.log(req.params,"called")
    try {
        const result = await projectModel.findOne({ _id: _id });
        // console.log(result)
        const dislikePeople = result.dislikePeople;
        // console.log(likedpeople)
        for (let i = 0; i < dislikePeople.length; i++) {
            if (dislikePeople[i].Uid == user_uid) {
                // console.log("called")
                return res.status(200).send({ dislike: 1 });
            }
        }
        res.status(200).send({ dislike: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message, type: 2 });
    }
}
const find_already_liked = async (req, res) => {
    const { user_uid, _id } = req.body;
    // console.log(req.body,"called")
    // console.log(req.params,"called")
    try {
        const result = await projectModel.findOne({ _id: _id });
        // console.log(result)
        const likedpeople = result.likePeople;
        // console.log(likedpeople)
        for (let i = 0; i < likedpeople.length; i++) {
            if (likedpeople[i].Uid == user_uid) {
                // console.log("called")
                return res.status(200).send({ like: 1 });
            }
        }
        res.status(200).send({ like: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message, type: 2 });
    }
}

module.exports = { getAllProjects, like_count_handler, comment_section_handler, find_already_liked, find_already_disliked }