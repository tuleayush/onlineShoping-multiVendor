const express = require("express");
const router = express.Router();
const user = require('../controllers/user');
const { grantAccess, verifyAdmin, allowIfLoggedin } = require("../middlewares/jwtHelper");


//Add New User

router.post("/create/:role", allowIfLoggedin, user.addUser);  //allowIfLoggedin Added
// Get All User

router.get("/get/:role?", allowIfLoggedin, user.getUsers);  // allowIfLoggedin Added

// Get User By Id

router.get("/getbyid/:id", allowIfLoggedin, user.getUserById);

// Get Current User Basic Data

router.get("/getmyinfo", allowIfLoggedin, user.getUser);

// Update User

router.put("/update/:id", allowIfLoggedin, user.updateUser);


// Delete User By Id

router.delete("/delete/:id", allowIfLoggedin, verifyAdmin, user.deleteUser);

// TO-DELETE: sample mail trigger 
router.get("/mail/:mail?", (req, res, next) => {
   const { newProductNotification } = require('../../email-templates/new_product_noti');
   newProductNotification({
      email: req.params?.mail
   }, async (er, resp) => {
      console.log(er, resp)
      res.status(200).json({});
   });
});


module.exports = router;