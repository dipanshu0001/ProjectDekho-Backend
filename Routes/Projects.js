const express = require('express');
const Router=express.Router();
const {getAllProjects}=require('../Controller/Projects_func')


Router.get('/allProjects',getAllProjects)


module.exports=Router