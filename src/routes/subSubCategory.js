const express = require("express");
const router = express.Router();
const subSubCategoryController=require('../controllers/subSubCategory');
const { allowIfLoggedin } = require("../middlewares/jwtHelper");


//Add New Sub Sub Category
router.post("/create",allowIfLoggedin, subSubCategoryController.Create);

// Get All Sub Sub Category
router.get("/get", subSubCategoryController.Get);

// Get Sub Sub Category By Id
router.get("/getbyid/:id", subSubCategoryController.GetById);

// Get Sub Sub Category By Sub Cat Id
router.get("/getbysubcatid/:subCatId", subSubCategoryController.GetBySubCatId);

// Get Sub Sub Category By Cat Id
router.get("/getbycatid/:catId", subSubCategoryController.GetByCatId);

// Get Sub Sub Category By StoreId
router.get("/getbystoreid/:storeId", subSubCategoryController.GetByStoreId);

// Update Sub Sub Category
router.put("/update/:subSubCatId",allowIfLoggedin, subSubCategoryController.Update);


// Delete Sub Sub Category By Id
router.delete("/delete/:id",allowIfLoggedin, subSubCategoryController.Delete);

module.exports = router;