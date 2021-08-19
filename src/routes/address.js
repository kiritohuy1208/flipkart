const express = require("express");
const router = express.Router();
const { verifyUserMiddleware, requiredSignin } = require('../middlewares')
const { addAddress, getAddress } = require('../controllers/address')

router
    .route('/user/address/create')
    .post(requiredSignin,verifyUserMiddleware,addAddress)
router
    .route('/user/getaddress')
    .post(requiredSignin,verifyUserMiddleware,getAddress)
module.exports = router;