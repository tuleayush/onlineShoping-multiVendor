const express = require("express");
const router = express.Router();
const cartController= require('../controllers/cart')
const { verifyAccessToken } = require("../middlewares/jwtHelper");

//Add New Cart

 
router.post("/create",verifyAccessToken,cartController.create);

// Get All Cart
 
router.get("/get",verifyAccessToken,cartController.get);

// Get Cart By Id

router.get("/getbyid/:id", cartController.getById);

// Update Cart
 
router.put("/update/:id", cartController.update);


// Delete Cart By Id
 
router.delete("/delete/:id", cartController.delete);

module.exports = router;