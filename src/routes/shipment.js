const express = require("express");
const router = express.Router();
const shipmentController = require('../controllers/shipment')
const { verifyAccessToken, grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");

router.get("/get", allowIfLoggedin, shipmentController.get);

router.post("/create", allowIfLoggedin, shipmentController.create);

router.put("/update/:id", allowIfLoggedin, shipmentController.update);

router.delete("/delete/:id", allowIfLoggedin, shipmentController.delete);

module.exports = router;