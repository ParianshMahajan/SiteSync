const express = require('express');
const { StopSite, StartSite, DeleteSite, RenameSite } = require('../Controllers/SiteContoller');
const { isAdmin } = require('../Middlewares/AdminProtect');

const SiteRouter = express.Router();


SiteRouter
.route('/stop')
.post(isAdmin,StopSite)

SiteRouter
.route('/start')
.post(isAdmin,StartSite)

SiteRouter
.route('/delete')
.post(isAdmin,DeleteSite)

SiteRouter
.route('/rename')
.post(isAdmin,RenameSite)



module.exports = SiteRouter;