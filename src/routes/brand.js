const express = require("express");
const router = express.Router();
const brandController = require('../controllers/brand');
const { grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");


//Add New Brand
router.post("/create", allowIfLoggedin, brandController.createBrand);

// Get All Brand
router.get("/get", brandController.getBrand);

// Get Brand By Id
router.get("/getbyid/:brandId", brandController.getBrandById);

// Update Brand
router.put("/update/:id", allowIfLoggedin, brandController.updateBrand);


// Delete Brand By Id
router.delete("/delete/:id", allowIfLoggedin, brandController.deleteBrand);

module.exports = router;