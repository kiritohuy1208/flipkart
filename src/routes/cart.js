const express= require('express')
const router = express.Router()
const { addItemToCart, getCartItems, removeCartItems } = require('../controllers/cart')
const { verifyUserMiddleware,requiredSignin } = require('../middlewares')

router.route('/user/cart/addtocart')
      .post(requiredSignin, verifyUserMiddleware, addItemToCart)
router.route('/user/getCartItems')
      .post(requiredSignin, verifyUserMiddleware, getCartItems )
router.route("/user/cart/removeItem")
      .post(requiredSignin, verifyUserMiddleware, removeCartItems)
module.exports = router