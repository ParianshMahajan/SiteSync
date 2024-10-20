const express = require('express');
const { isAdmin } = require('../Middlewares/AdminProtect');
const { accessRepos } = require('../Controllers/GitController');

const GitRouter = express.Router();

// static

GitRouter
.route('/repos')
.post(isAdmin,accessRepos)



module.exports = GitRouter;