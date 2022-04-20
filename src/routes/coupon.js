const express = require("express");
const router = express.Router();
const couponController= require('../controllers/coupon')


//Add New Coupon

router.post("/create",couponController.createCoupon);

// Get All Coupon
 
router.get("/get",couponController.getCoupon);

// Get Coupon By Id

router.get("/getbyid/:couponId", couponController.getCouponById);

// Update Coupon


router.put("/update/:couponId", couponController.updateCoupon);


// Delete coupon By Id

router.delete("/delete/:id", couponController.deleteCoupon);

module.exports = router;