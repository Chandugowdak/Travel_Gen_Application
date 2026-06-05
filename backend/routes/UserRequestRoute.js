const  { createUserRequest, EditUserRequst, DeleteUserRequest } = require('../controllers/UserRequestes');
const verifyUser = require('../middleware/Auth');
const express = require('express');
const requestroute = express.Router();


requestroute.post('/create/request' , verifyUser, createUserRequest);
requestroute.put('/edit/request/:id' , verifyUser, EditUserRequst);
requestroute.delete('/delete/request/:id' , verifyUser, DeleteUserRequest);


module.exports = requestroute;