const express = require('express');
const { StopSite, StartSite, DeleteSite, RenameSite } = require('../Controllers/SiteContoller');
const { isAdmin } = require('../Middlewares/AdminProtect');

const SiteRouter = express.Router();


SiteRouter
.route('/stop')
.post(StopSite)

SiteRouter
.route('/start')
.post(StartSite)

SiteRouter
.route('/delete')
.post(DeleteSite)

SiteRouter
.route('/rename')
.post(RenameSite)



module.exports = SiteRouter;