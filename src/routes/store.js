const express = require("express");
const router = express.Router();
const storeController=require('../controllers/store');
const upload = require('../utilities/fileUploader');
const { allowIfLoggedin } = require("../middlewares/jwtHelper");



//Add New Store
router.post("/create",allowIfLoggedin, upload.array('store', 10), storeController.Create);

// Get All store
router.get("/get", storeController.Get);

// Get Store By cat Id
router.get("/getbycatid/:catId", storeController.GetByCatId);

// Get store By store Id
router.get("/getbyid/:storeId", storeController.GetById);

// Update Store
router.put("/update/:storeId",allowIfLoggedin, storeController.Update);

router.delete("/delete/:id", storeController.Delete);

module.exports = router;