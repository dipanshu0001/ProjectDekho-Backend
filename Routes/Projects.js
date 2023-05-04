const express = require('express');
const Router=express.Router();
const {getAllProjects,like_count_handler}=require('../Controller/Projects_func')


Router.get('/allProjects',getAllProjects)
Router.get('/likecount/:id/:check/:user',like_count_handler)

module.exports=Router