const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Coupon = require("../models/Coupon");
const couponSchema = require('../utilities/validation-schemas/couponSchema');

module.exports={
//Add New Coupon
createCoupon: async (req, res, next) => {
  try {  
    let body = JSON.parse(req.body.data)
    
    if (req.files && req.files.length){
      body.image = req.files.map(img=>(img.destination+'/'+img.filename))
    }             
    const result = await couponSchema.validateAsync(body);
    const coupon = new Coupon(result);
    const newCoupon = await coupon.save();
    res.status(200).send(newCoupon);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Get All Coupon
getCoupon:async (req, res, next) => {
  try {      
    const data = await Coupon.find({isDeleted:false});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Get Coupon By Id
getCouponById: async (req, res, next) => {
  try {    
    const {couponId}=req.params 
    if(!couponId) throw createError.NotFound(`CouponId Not Found`);
    const data = await Coupon.findOne({_id:couponId,isDeleted:false});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Update Coupon
updateCoupon:async (req, res, next) => {
  try {    
    const {couponId}=req.params
    let body = JSON.parse(req.body.data)
    
    if (req.files && req.files.length){
      body.image = req.files.map(img=>(img.destination+'/'+img.filename))
    } 
    const result = await couponSchema.validateAsync(body);         
    if(!couponId) throw createError.NotFound(`Coupon Id Not Found`);
    const data = await Coupon.findOneAndUpdate({_id:couponId},result);
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},


// Delete Coupon By Id
deleteCoupon:async (req, res, next) => {
  try {    
    const {id}=req.params 
    if(!id) throw createError.NotFound(`Coupon Id Not Found`);
    const data = await Coupon.findByIdAndUpdate({_id:id},{isDeleted:true});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
}

}