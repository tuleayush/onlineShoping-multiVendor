const express = require("express");
const router = express.Router();
const colorController = require('../controllers/color');
const { verifyAccessToken, grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");

router.get("/get", allowIfLoggedin, colorController.get);

router.post("/create", allowIfLoggedin, colorController.create);

// router.put("/update/:id", allowIfLoggedin, colorController.update);

router.delete("/delete/:id", allowIfLoggedin, colorController.delete);

module.exports = router;