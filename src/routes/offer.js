const express = require("express");
const router = express.Router();
const offerController= require('../controllers/offer')


//Add New Offer

router.post("/create",offerController.createOffer);

// Get All Offer

router.get("/get",offerController.getOffer);

// Get Offer By Id

router.get("/getbyid/:offerId", offerController.getOfferById);

// Update Offer

router.put("/update", offerController.updateOffer);


// Delete Offer By Id

router.delete("/delete/:id", offerController.deleteOffer);

module.exports = router;