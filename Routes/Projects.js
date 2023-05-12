const express = require('express');
const Router=express.Router();
const {getAllProjects,
    like_count_handler,
    comment_section_handler,
    find_already_liked,
    find_already_disliked,
    Get_ParticularProject
}=require('../Controller/Projects_func')


Router.get('/allProjects',getAllProjects)
.post('/likecount/:id/:check/:user',like_count_handler)
.post('/comment/:user/:id',comment_section_handler)
.post('/Already_liked',find_already_liked)
.post('/Already_disliked',find_already_disliked)
.post('/Get_ParticularProject',Get_ParticularProject)


module.exports=Router