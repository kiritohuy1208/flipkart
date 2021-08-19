const express = require("express");
const router = express.Router();
const { signin, signup, signout } = require('../controllers/auth')
const {validateSigninRequest,verifyValidate,validateSignupRequest} = require('../validators/auth')
const {} = require('express-validator')

router
    .route('/signin')
    .post(validateSigninRequest,verifyValidate,signin)
router
    .route('/signup')
    .post(validateSignupRequest,verifyValidate,signup)
router
    .route('/signout')
    .post(signout)
// router
//     .route('/profile')
//     .get( requiredSignin, profile )
module.exports = router;