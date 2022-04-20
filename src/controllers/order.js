const express = require("express");
const createError = require("http-errors");
const { ObjectId } = require('mongoose');

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Address = require("../models/Address");
const ProductOptionVariant = require("../models/ProductOptionVariant");
const orderSchema = require('../utilities/validation-schemas/orderSchema');
const resS = require('../utilities/sendFormat');
const { PaymentStatus, PaymentMode, PaymentMethod } = require("../utilities/constants/payment");
const { OrderCodeSequence } = require("../utilities/constants/sequence");
const { generateSequenceFromType } = require("../utilities/sequenceUtils");
const OptionVariant = require("../models/OptionVariant");

module.exports = {
  //Add New order
  create: async (req, res, next) => {
    const sessionPayment = await Payment.startSession();
    const sessionOrder = await Order.startSession();

    sessionPayment.startTransaction();
    sessionOrder.startTransaction();

    try {
      const {
        // order
        addressId, items,
        // payment
        mode, method
      } = req.body;

      if (!addressId || !items?.length || !mode || !method)
        return resS.sendError(res, 400, 'Bad Request! Insufficient body data!', req.body);

      if (!Object.values(PaymentMode).includes(mode))
        return resS.sendError(res, 400, 'Bad Request! Invalid Payment Mode!', req.body);

      if (!Object.values(PaymentMethod).includes(method))
        return resS.sendError(res, 400, 'Bad Request! Invalid Payment Method!', req.body);

      for (let i = 0; i < items?.length; i++) {
        if (!items[i]?.quantity || !items[i]?.productOptionVariantId || !items[i]?.amount)
          return resS.sendError(res, 400, 'Bad Request! Insufficient items data!', req.body);
      }

      const totalAmount = items.reduce((a, item) => a + (item?.amount || 0), 0);

      // Product Option Variant
      const productOptionVariantIds = items.map(i => i.productOptionVariantId);

      let productOptVar = await ProductOptionVariant.find({
        _id: { $in: productOptionVariantIds },
        isDeleted: false
      }, {}).lean();

      if (productOptVar?.length !== productOptionVariantIds?.length)
        return resS.sendError(res, 400, 'Bad Request! Trying to order inactive variant(s)!', req.body);

      productOptVar = productOptVar.reduce((a, p) => {
        a[p?._id] = p;
        return a;
      }, {});

      // Address
      let address = await Address.findOne({ _id: addressId, isDeleted: false }, {}).lean();

      if (!address)
        return resS.sendError(res, 400, 'Bad Request! Trying to order with inactive address!', req.body);

      // Payment
      const payment = await Payment.create({
        mode, method, totalAmount, status: PaymentStatus.paid,
        createdBy: req?.user || null,
        updatedBy: req?.user || null
      });

      // Order
      items.forEach(item => {
        item.productOptionVariant = productOptVar[item.productOptionVariantId] || null;
      });

      const order = await Order.create({
        code: await generateSequenceFromType(OrderCodeSequence),
        items,
        address,
        paymentId: payment?._id || null,
        createdBy: req?.user || null,
        updatedBy: req?.user || null
      });

      await sessionPayment.commitTransaction();
      await sessionOrder.commitTransaction();

      return resS.send(res, 'Created', {});

    }
    catch (error) {
      await sessionPayment.abortTransaction();
      await sessionOrder.abortTransaction();

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get All Orders
  get: async (req, res, next) => {
    try {
      let data = await Order.find({ isDeleted: false }, { code: 1, 'items.productOptionVariant.optionVariantIds': 1, 'items.productOptionVariant.productId': 1, 'items._id': 1, 'items.quantity': 1, 'items.amount': 1, status: 1, createdAt: 1, paymentId: 1 })
        .populate({
          path: 'items.productOptionVariant.optionVariantIds',
          select: 'optionId name -_id',
          populate: {
            path: 'optionId',
            select: 'name -_id'
          }
        })
        .populate({
          path: 'items.productOptionVariant.productId',
          select: 'name -_id',
        })
        .populate({
          path: 'paymentId',
          select: 'mode method status totalAmount',
        });

      data = data.reduce((a, d) => {
        a.push(
          ...d?.items?.map(item => {
            return {
              code: d?.code || '',
              productName: item?.productOptionVariant?.productId?.name || '',
              optionVariant: item?.productOptionVariant?.optionVariantIds?.map(optVar => `${optVar?.name} (${optVar?.optionId?.name})`)?.join('  +  '),
              status: d?.status || '',
              paymentStatus: d?.paymentId?.status || '',
              paymentMethod: d?.paymentId?.method || '',
              date: d?.createdAt ? new Date(d?.createdAt).toISOString()?.split('.')[0]?.replace('T', ' ') : '',
              total: d?.paymentId?.totalAmount || null,
              amount: item?.amount || null,
              quantity: item?.quantity || null,
            };
          }) || []
        );
        return a;
      }, []);

      return resS.send(res, 'Loaded Successfully!', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Transaction
  getTransactions: async (req, res, next) => {
    try {
      let data = await Order.find({ isDeleted: false }, { code: 1, paymentId: 1 })
        .populate({
          path: 'paymentId',
          select: 'mode method status totalAmount transactionId createdAt updatedAt',
        });

      data = data.map(d => {
        return {
          code: d?.code || '',
          transactionId: d?.transactionId || '',
          mode: d?.paymentId?.mode || '',
          status: d?.paymentId?.status || '',
          method: d?.paymentId?.method || '',
          createdAt: d?.paymentId?.createdAt ? new Date(d?.paymentId?.createdAt).toISOString()?.split('.')[0]?.replace('T', ' ') : '',
          updatedAt: d?.paymentId?.updatedAt ? new Date(d?.paymentId?.updatedAt).toISOString()?.split('.')[0]?.replace('T', ' ') : '',
          total: d?.paymentId?.totalAmount || null,
        };
      });

      return resS.send(res, 'Loaded Successfully!', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Order By Id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const data = await Order.findOne({ _id: id, isDeleted: false });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Order
  update: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const result = await orderSchema.validateAsync(req.body);

      const data = await Order.findOneAndUpdate({ _id: id }, result);
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },


  // Delete Order By Id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const data = await Order.findByIdAndUpdate({ _id: id }, { isDeleted: true });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }

}