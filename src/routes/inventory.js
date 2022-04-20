const express = require("express");
const router = express.Router();
const inventoryController = require('../controllers/inventory')
const { verifyAccessToken, grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");

// Get All Inventory
router.get("/get", allowIfLoggedin, inventoryController.Get);

// Update Inventory
router.put("/update/:id", allowIfLoggedin, inventoryController.Update);

module.exports = router;