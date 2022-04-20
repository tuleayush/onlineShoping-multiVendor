const express = require("express");
const router = express.Router();
const orderController= require('../controllers/order')
const {allowIfLoggedin} = require('../middlewares/jwtHelper')

//Add New Order

router.post("/place", allowIfLoggedin, orderController.create);

// Get All Order

router.get("/get", allowIfLoggedin, orderController.get);

// Get Transacetions
router.get("/getTransactions", allowIfLoggedin, orderController.getTransactions);

// Get Order By Id

router.get("/getbyid/:id", allowIfLoggedin, orderController.getById);


// Update Order

router.put("/update/:id", allowIfLoggedin, orderController.update);


// Delete Order By Id

router.delete("/delete/:id", allowIfLoggedin, orderController.delete);

module.exports = router;