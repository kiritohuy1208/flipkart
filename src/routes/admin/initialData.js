const express = require("express");
const { initialData } = require("../../controllers/admin/initialData");
const router = express.Router();

router
    .route('/initialdata')
    .post(initialData)
module.exports = router;