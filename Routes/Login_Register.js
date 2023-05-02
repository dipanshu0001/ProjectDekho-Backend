const express = require('express');
const Router=express.Router();
const {Register,Login,RefreshToken,clear_cookie}=require('../Controller/Login_Register_func')


Router.post('/Register',Register)
.post('/Login',Login)
.post('/RefreshToken',RefreshToken)
.post("/ClearCookie",clear_cookie)


module.exports=Router