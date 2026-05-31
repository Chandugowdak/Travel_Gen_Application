const express = require('express');
const Userroute = express.Router();

const {registeruser, Userlogin} = require('../controllers/User');

Userroute.post('/register', registeruser);
Userroute.post('/login', Userlogin);

module.exports = Userroute;