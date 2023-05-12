const express = require('express');
const Router = express.Router();
const { AddProject, CheckReactRepo,CheckNodeRepoMiddleware,Get_User,CheckReactRepoMiddleware,CheckNodeRepo } = require('../Controller/User_functions.js')


Router.post('/Addproject', AddProject)
      .post('/CheckReactRepo',CheckReactRepoMiddleware, CheckReactRepo)
      .post('/CheckNodeRepo',CheckNodeRepoMiddleware, CheckNodeRepo)
      .post('/Get_User',Get_User)

module.exports = Router;