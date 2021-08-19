const express = require("express");
const router = express.Router();
const { signin, signup, signout } = require('../../controllers/admin/auth')
const {validateSigninRequest,verifyValidate,validateSignupRequest} = require('../../validators/auth')

router
    .route('/signin')
    .post(validateSigninRequest,verifyValidate,signin("admin"))
router
    .route('/signup')
    .post(validateSignupRequest,verifyValidate,signup("admin"))
router
    .route('/signout')
    .post(signout)
module.exports = router;