const express = require("express");
const router = express.Router();
const navigationController = require('../controllers/navigation')
const { verifyAccessToken, grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");

router.get("/get", allowIfLoggedin, navigationController.get);

module.exports = router;