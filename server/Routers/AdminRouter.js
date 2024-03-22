const express = require('express');
const { createJWT, AllSites, isAvailable } = require('../Controllers/AdminController');
const { isAdmin } = require('../Middlewares/AdminProtect');

const AdminRouter = express.Router();


// Create JWT
AdminRouter
.route('/')
.post(createJWT)



// All Sites
AdminRouter
.route('/sites')
.post(isAdmin,AllSites)


// IsAvailable
AdminRouter
.route('/isavailable')
.post(isAdmin,isAvailable)





module.exports=AdminRouter;