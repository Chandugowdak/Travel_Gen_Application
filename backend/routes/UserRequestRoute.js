const  { createUserRequest, EditUserRequst, DeleteUserRequest, getUserRequests, regenerateUserRequest } = require('../controllers/UserRequestes');
const verifyUser = require('../middleware/Auth');
const express = require('express');
const requestroute = express.Router();


requestroute.post('/create/request' , verifyUser, createUserRequest);
requestroute.put('/edit/request/:id' , verifyUser, EditUserRequst);
requestroute.delete('/delete/request/:id' , verifyUser, DeleteUserRequest);
requestroute.get('/user-requests/:userID', verifyUser, getUserRequests);
requestroute.post('/regenerate/request/:id', verifyUser, regenerateUserRequest);


module.exports = requestroute;