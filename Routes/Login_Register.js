const express = require('express');
const Router=express.Router();
const {Register,Login,RefreshToken}=require('../Controller/Login_Register_func')


Router.post('/Register',Register)
.post('/Login',Login)
.post('/RefreshToken',RefreshToken);


module.exports=Router