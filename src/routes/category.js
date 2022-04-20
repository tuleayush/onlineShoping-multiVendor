const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/category')
const { grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");


//Add New Category
router.post("/create", allowIfLoggedin, categoryController.Create);

// Get All Category
router.get("/get", categoryController.Get);

// Get Category By Id
router.get("/getbyid/:catid", allowIfLoggedin, categoryController.GetById);

// Update Category
router.put("/update/:id", allowIfLoggedin, categoryController.Update);


// Delete Category By Id
router.delete("/delete/:id", categoryController.Delete);

module.exports = router;