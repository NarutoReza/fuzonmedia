const express = require('express');
const router = express.Router();

const { addUser, verifyOtp, loginUser, userDetails } = require('../Controller/LoginController');
const { createContact, getContactList, updateContact, deleteContact } = require('../Controller/ContactControl')
const verifyToken = require('../Middleware/authMiddleware');


// user routes
router.post('/signup', addUser); //signup
router.post('/verify', verifyOtp); //verify signup otp 
router.post('/login', loginUser); //login user
router.post('/user', verifyToken, userDetails) // get user details after login

//contact routes
router.post('/createContact', verifyToken, createContact) // create a contact
router.post('/contacts', verifyToken, getContactList) // get contact lists of user with skip, sort, limit
router.patch('/updateContact/:postId', verifyToken, updateContact) //update a contact
router.delete('/deleteContact/:postId', verifyToken, deleteContact) // delete a contact


module.exports = router;