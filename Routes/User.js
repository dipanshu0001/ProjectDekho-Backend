const express = require('express');
const Router = express.Router();
const { AddProject, CheckReactRepo,CheckNodeRepoMiddleware,CheckReactRepoMiddleware,CheckNodeRepo } = require('../Controller/User_functions.js')


Router.post('/Addproject', AddProject)
      .post('/CheckReactRepo',CheckReactRepoMiddleware, CheckReactRepo)
      .post('/CheckNodeRepo',CheckNodeRepoMiddleware, CheckNodeRepo);

module.exports = Router;