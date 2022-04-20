const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Offer = require("../models/Offer");
const offerSchema = require('../utilities/validation-schemas/offerSchema');

module.exports={
//Add New Offer
createOffer: async (req, res, next) => {
  try {      
    const result = await offerSchema.validateAsync(req.body);
    const offer = new Offer(result);
    const newOffer = await offer.save();
    res.status(200).send(newOffer);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Get All Offer
getOffer:async (req, res, next) => {
  try {      
    const data = await Offer.find({isDeleted:false});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Get Offer By Id
getOfferById: async (req, res, next) => {
  try {    
    const {offerId}=req.params 
    if(!offerId) throw createError.NotFound(`OfferId Not Found`);
    const data = await Offer.findOne({_id:offerId,isDeleted:false});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},

// Update Offer
updateOffer:async (req, res, next) => {
  try {    
    const {offerId,name}=req.body 
    if(!offerId) throw createError.NotFound(`Offer Id Not Found`);
    if(!name) throw createError.NotFound(`Name Not Found`);
    const data = await Offer.findOneAndUpdate({_id:offerId},{name});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
},


// Delete Offer By Id
deleteOffer:async (req, res, next) => {
  try {    
    const {id}=req.params 
    if(!id) throw createError.NotFound(`Offer Id Not Found`);
    const data = await Offer.findByIdAndUpdate({_id:id},{isDeleted:true});
    res.status(200).send(data);

  } catch (error) {
      if(error.isJoi === true) error.status = 422
    next(error);
  }
}

}