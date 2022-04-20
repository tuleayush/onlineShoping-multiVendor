const express = require("express");
const router = express.Router();
const optionController = require('../controllers/option')
const {allowIfLoggedin } = require("../middlewares/jwtHelper");

// Get All Options
router.get("/get", allowIfLoggedin, optionController.Get);

module.exports = router;