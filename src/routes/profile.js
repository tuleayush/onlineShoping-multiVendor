const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profile')
const { allowIfLoggedin } = require("../middlewares/jwtHelper");
const upload = require('../utilities/fileUploader');

// Get Profile By userId
router.get("/getbyuserid", allowIfLoggedin, profileController.getProfileByUserId);

// Update 
router.put("/update/:id", allowIfLoggedin, upload.fields([{ name: 'storeLogoImage', maxCount: 1 }, { name: 'storeHomeImage', maxCount: 1 }]),
    profileController.updateProfile);

// Delete Profile By Id
router.delete("/delete/:id", allowIfLoggedin, profileController.deleteProfile);

module.exports = router;