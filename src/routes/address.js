const express = require("express");
const router = express.Router();
const addressController= require('../controllers/address')
const {verifyAccessToken} = require('../middlewares/jwtHelper')

//Add New Address

router.post("/create",verifyAccessToken,addressController.create);

// Get All Address


router.get("/get",verifyAccessToken,addressController.get);

// Get Address By Id


router.get("/getbyid/:id",verifyAccessToken, addressController.getById);

// Update Address

router.put("/update/:id",verifyAccessToken, addressController.update);


// Delete Address By Id


router.delete("/delete/:id",verifyAccessToken, addressController.delete);

module.exports = router;