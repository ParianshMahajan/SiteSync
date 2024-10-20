const express = require('express');
const { createJWT, AllSites, verifyLogIn, SearchSite, updatePassword, test } = require('../Controllers/AdminController');
const { isAdmin } = require('../Middlewares/AdminProtect');

const AdminRouter = express.Router();


// Create JWT
AdminRouter
.route('/')
.post(createJWT)


// Verify
AdminRouter
.route('/verify')
.get(isAdmin,verifyLogIn)

// Update Password
AdminRouter
.route('/update-password')
.post(isAdmin,updatePassword)



// Search Site
AdminRouter
.route('/searchsite')
.post(isAdmin,SearchSite)

// All Sites
AdminRouter
.route('/sites')
.post(isAdmin,AllSites)

AdminRouter
.route('/test')
.get(test)




module.exports=AdminRouter;