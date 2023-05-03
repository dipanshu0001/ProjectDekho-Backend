const projectModel = require('../Model/UserProject')

const getAllProjects = async(req, res) => {
    try{
        const allProjects  =  await projectModel.find({});
        res.status(200).json(allProjects);
    }catch (error) {
         
        res.status(500).json({error:error.message})
    }
}

module.exports = { getAllProjects }