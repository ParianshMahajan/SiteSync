const express = require('express');
const { StopSite, StartSite, DeleteSite } = require('../Controllers/SiteContoller');

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



module.exports = SiteRouter;