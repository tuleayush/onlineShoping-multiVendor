const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const SubCategoryController= require('../controllers/subCategory');
const { allowIfLoggedin } = require("../middlewares/jwtHelper");


//Add New Sub Category
router.post("/create",allowIfLoggedin, SubCategoryController.Create);

// Get All Sub Category
router.get("/get", SubCategoryController.Get);

// Get Sub Category By Id
router.get("/getbyid/:subCatId", SubCategoryController.GetById);

// Get Sub Category By Cat Id
router.get("/getbycatid/:catId", SubCategoryController.GetByCatId);

// Get Sub Category By StoreId
router.get("/getbystoreid/:storeId", SubCategoryController.GetByStoreId);

// Update Sub Category
router.put("/update/:subCatId",allowIfLoggedin, SubCategoryController.Update);

// Delete Sub Category By Id
router.delete("/delete/:id",allowIfLoggedin, SubCategoryController.Delete);

module.exports = router;