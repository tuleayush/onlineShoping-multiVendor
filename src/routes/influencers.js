const express = require("express");
const router = express.Router();
const influencersController = require('../controllers/influencers');

//Add New Influencers
router.post("/create", influencersController.createInfluencers);

// Get All Influencers
router.get("/get", influencersController.getInfluencers);

// Get Influencers By Id
router.get("/getbyid/:id", influencersController.getInfluencersById);

// Update Brand
router.put("/update/:id", influencersController.updateInfluencers);


// Delete Influencers By Id
router.delete("/delete/:id", influencersController.deleteInfluencers);

module.exports = router;