const express = require('express');
const { StopSite, StartSite, DeleteSite, RenameSite } = require('../Controllers/SiteContoller');
const { isAdmin } = require('../Middlewares/AdminProtect');

const GitRouter = express.Router();

// static

GitRouter
.route('/repos')
.post(isAdmin,StopSite)



module.exports = GitRouter;