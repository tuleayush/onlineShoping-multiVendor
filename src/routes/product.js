const express = require("express");
const router = express.Router();
const upload = require('../utilities/fileUploader');
const productController = require('../controllers/product')
const {grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");


router.get("/getById/:id", allowIfLoggedin, productController.GetById);

router.get("/getByCode/:code", allowIfLoggedin, productController.GetByCode);

router.get("/getProductAllOptionVariantsById/:id", allowIfLoggedin, productController.GetAllOptionVariantsById);

router.get("/getUpdateDataById/:id", allowIfLoggedin, productController.GetUpdateDataById);

router.post("/create", allowIfLoggedin, upload.array('product', 10), productController.Create);

router.put("/update/:id", allowIfLoggedin, upload.array('product', 10), productController.Update);

router.put("/approve/:id", allowIfLoggedin, productController.Approve);

router.get("/get/:search?", allowIfLoggedin, productController.Get);

router.delete("/delete/:id", productController.Delete);

module.exports = router;