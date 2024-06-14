const express = require('express');
const { createJWT, AllSites, verifyLogIn, SearchSite } = require('../Controllers/AdminController');
const { isAdmin } = require('../Middlewares/AdminProtect');

const AdminRouter = express.Router();


// Create JWT
AdminRouter
.route('/')
.post(createJWT)


// Verify
AdminRouter
.route('/verify')
.post(verifyLogIn)



// Search Site
AdminRouter
.route('/searchsite')
.post(SearchSite)

// All Sites
AdminRouter
.route('/sites')
.post(AllSites)




module.exports=AdminRouter;