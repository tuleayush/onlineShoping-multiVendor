const express = require("express");
const router = express.Router();
const staticPageController = require('../controllers/staticPage')
const { verifyAccessToken, grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");

// Get Specific Page
router.get("/get/:key", allowIfLoggedin, staticPageController.GetByKey);

// Update Inventory
router.put("/update/:key", allowIfLoggedin, staticPageController.UpdateByKey);

module.exports = router;