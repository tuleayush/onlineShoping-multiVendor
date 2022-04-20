const express = require("express");
const router = express.Router();
const authRoute = require('./auth');
const categoryRoute = require('./category');
const storeRoute = require('./store');
const subCategoryRoute = require('./subCategory');
const subSubCategoryRoute = require('./subSubCategory');
const product = require('./product');
const user = require('./user');
const file = require('./file')
const role = require('./role')
const cart = require('./cart')
const order = require('./order')
const address = require('./address')
const brand = require('./brand')
const offer = require('./offer')
const coupon = require('./coupon')
const profile = require('./profile');
const option = require("./option");
const influencers = require("./influencers");
const shipment = require('./shipment');
const color= require('./color');
const inventory = require('./inventory')
const navigation = require('./navigation')
const staticPage = require('./staticPage')




router.use('/auth',authRoute);
router.use('/category',categoryRoute);
router.use('/store',storeRoute);
router.use('/subcategory',subCategoryRoute);
router.use('/subsubcategory',subSubCategoryRoute);
router.use('/option',option);
router.use('/product',product);
router.use('/user',user);
router.use('/role',role);
router.use('/cart',cart);
router.use('/order',order);
router.use('/address',address);
router.use('/brand',brand);
router.use('/offer',offer);
router.use('/coupon',coupon);
router.use('/file',file)
router.use('/profile',profile)
router.use('/influencer',influencers)
router.use('/shipment', shipment)
router.use('/color', color);
router.use('/inventory', inventory)
router.use('/navigation', navigation)
router.use('/staticPage', staticPage)



module.exports=router