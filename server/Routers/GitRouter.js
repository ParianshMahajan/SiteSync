const express = require('express');
const { isAdmin } = require('../Middlewares/AdminProtect');
const { accessRepos, deployGitUrl } = require('../Controllers/GitController');

const GitRouter = express.Router();

// static

GitRouter
.route('/repos')
.post(accessRepos)

GitRouter
.route('/test')
.get((req,res)=>{
	res.json({
		message:"Git Router is working"
	})
})



module.exports = GitRouter;