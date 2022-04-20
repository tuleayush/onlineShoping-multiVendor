const express = require("express");
const router = express.Router();
const roleController= require('../controllers/role')


//Add New Role

router.post("/create",roleController.create);

// Get All Role

router.get("/get",roleController.get);

// Get Role By Id

router.get("/getbyid/:id", roleController.getById);


router.get("/getStaffRoles", roleController.getStaffRoles);

// Update Role

 router.put("/update/:id", roleController.update);


// Delete Role By Id
router.delete("/delete/:id", roleController.delete);

module.exports = router;