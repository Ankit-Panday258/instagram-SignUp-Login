const express = require('express');
const jwtAuth = require('../middleware/jwtAuth.js');
const authRouter = express.Router();
const {signup , signin , getUser, logout} = require('../controller/authCountroller.js');



authRouter.post('/signup' ,signup)
authRouter.post('/signin' ,signin)
authRouter.get('/user' , jwtAuth ,getUser);
authRouter.get('/logout', jwtAuth ,logout)
module.exports = authRouter;