const express = require("express");
const createError = require("http-errors");
const { Types } = require("mongoose");

const Product = require("../models/Product");
const OptionVariant = require("../models/OptionVariant");
const ProductOptionVariant = require("../models/ProductOptionVariant");
const Inventory = require("../models/Inventory");
const Sequence = require("../models/Sequence");
const { ProductCodeSequence } = require("../utilities/constants/sequence");
const resS = require("../utilities/sendFormat");
// const { trackUpload } = require('../utilities/fileUploadTrack');
const {
  trackUpload,
  parsePathFromFileObject,
} = require("../utilities/fileUploadHelper");
const { ImageProviders } = require("../utilities/constants/image");
const { ApprovalStatus } = require("../utilities/constants/product");
const { generateSequenceFromType } = require("../utilities/sequenceUtils");

module.exports = {
  // Get Product By Id
  GetById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const data = await Product.findOne(
        { _id: id, isDeleted: false },
        { createdAt: 0, updatedAt: 0, createdBy: 0, updatedBy: 0 }
      )
        .populate("catId", "name")
        .populate("subCatId", "name");

      if (!data) throw createError.NotFound(`No Product Found`);

      return resS.send(res, "Fetched Successfully !", {
        code: data?.code || "",
        name: data?.name || "",
        description: data?.description || "",
        catName: data?.catId?.name || "",
        subCatName: data?.subCatId?.name || "",
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Product By Code
  GetByCode: async (req, res, next) => {
    try {
      const { code } = req.params;
      if (!code) throw createError.NotFound(`Bad Request`);

      const data = await Product.findOne(
        { code, isDeleted: false },
        { code: 1, name: 1, description: 1, images: 1, catId: 1, subCatId: 1 }
      )
        .populate("catId", "name")
        .populate("subCatId", "name");

      if (!data) throw createError.NotFound(`No Product Found`);

      return resS.send(res, "Fetched Successfully !", {
        code: data?.code || "",
        name: data?.name || "",
        description: data?.description || "",
        catName: data?.catId?.name || "",
        subCatName: data?.subCatId?.name || "",
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get All Option Variants By Id
  GetAllOptionVariantsById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const data = await ProductOptionVariant.aggregate([
        { $match: { productId: Types.ObjectId(id), isDeleted: false } },
        {
          $project: {
            _id: 1,
            productId: 1,
            "price.actualPrice": 1,
            "price.discountPricePercent": 1,
            optionVariantIds: 1,
          },
        },
        // Lookup to check the inventory
        {
          $lookup: {
            from: "inventory",
            let: { pId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$productOptionVariantId", "$$pId"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, quantity: 1 } },
              { $limit: 1 },
            ],
            as: "inventoryQty",
          },
        },
        { $addFields: { inventoryQty: { $first: "$inventoryQty" } } },
        {
          $addFields: {
            inventoryQty: {
              $cond: ["$inventoryQty.quantity", "$inventoryQty.quantity", 0],
            },
          },
        },
        // Lookup to populate option variants
        {
          $lookup: {
            from: "option_variants",
            let: { ovId: "$optionVariantIds" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$ovId"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, property: 1, optionId: 1 } },
              {
                $lookup: {
                  from: "options",
                  let: { optionId: "$optionId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$optionId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                    { $project: { _id: 0, type: 1, name: 1, order: 1 } },
                    { $limit: 1 },
                  ],
                  as: "option",
                },
              },
              { $addFields: { option: { $first: "$option" } } },
              { $sort: { "option.order": 1 } },
              { $project: { optionId: 0 } },
            ],
            as: "optionVariants",
          },
        },
        // Lookup to populate product data
        {
          $lookup: {
            from: "products",
            let: { productId: "$productId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$productId"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  code: 1,
                  name: 1,
                  description: 1,
                  images: 1,
                },
              },
              { $limit: 1 },
            ],
            as: "product",
          },
        },
        { $addFields: { product: { $first: "$product" } } },
        { $project: { _id: 0, optionVariantIds: 0, productId: 0 } },
        {
          $facet: {
            result: [], // will contain till now result
            product: [
              // will contain the product info
              { $project: { product: 1 } },
              { $limit: 1 },
            ],
            master: [
              // will evaluate the master option variants
              { $project: { optionVariants: 1 } },
              {
                $unwind: {
                  preserveNullAndEmptyArrays: true,
                  path: "$optionVariants",
                },
              },
              {
                $group: {
                  _id: {
                    otpName: "$optionVariants.name",
                    optVarType: "$optionVariants.option.type",
                  },
                  data: { $first: "$$ROOT" },
                },
              },
              { $replaceRoot: { newRoot: "$data.optionVariants" } },
              { $sort: { "option.order": 1, name: 1 } },
            ],
          },
        },
        { $addFields: { product: { $first: "$product" } } },
        {
          $addFields: {
            product: { $cond: ["$product.product", "$product.product", {}] },
          },
        },
      ]);

      const toSend = {
        product: data[0]?.product || {},
        productOptionVariant: data[0]?.result || [],
        optionVariants:
          data[0]?.master?.reduce((a, o) => {
            a[o?.option?.order] = a[o?.option?.order] || [];
            a[o?.option?.order].push(o);
            return a;
          }, {}) || {},
        isOutOfStock: false,
      };

      toSend.isOutOfStock = toSend.productOptionVariant?.every(
        (opt) => opt?.inventoryQty === 0
      );

      return resS.send(res, "Fetched Successfully !", toSend);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get All Products
  Get: async (req, res, next) => {
    try {
      const { search = "" } = req.params;

      const products = await Product.aggregate([
        { $match: { isDeleted: false, name: new RegExp(search, "i") } },
        {
          $project: {
            code: 1,
            name: 1,
            description: 1,
            images: 1,
            catId: 1,
            subCatId: 1,
            approvalStatus: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 30 }, // limiting 50 products max at a time
        {
          $lookup: {
            from: "category",
            let: { catId: "$catId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$catId"] } } },
              { $project: { _id: 0, name: 1 } },
            ],
            as: "catD",
          },
        },
        {
          $lookup: {
            from: "sub_category",
            let: { subCatId: "$subCatId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$subCatId"] } } },
              { $project: { _id: 0, name: 1 } },
            ],
            as: "subCatD",
          },
        },
        {
          $addFields: {
            catName: { $first: { $cond: ["$catD.name", "$catD.name", []] } },
            subCatName: {
              $first: { $cond: ["$subCatD.name", "$subCatD.name", []] },
            },
          },
        },
        { $project: { catId: 0, subCatId: 0, catD: 0, subCatD: 0 } },
        {
          $lookup: {
            from: "option_variants",
            let: { pId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$$pId", "$productId"] } } },
              { $project: { _id: 0, name: 1, property: 1, optionId: 1 } },
              {
                $lookup: {
                  from: "options",
                  let: { optionId: "$optionId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$optionId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                    { $project: { _id: 0, type: 1, name: 1, order: 1 } },
                    { $limit: 1 },
                  ],
                  as: "option",
                },
              },
              { $addFields: { option: { $first: "$option" } } },
              { $sort: { "option.order": 1 } },
              { $project: { optionId: 0 } },
              { $group: { _id: "$option.type", options: { $push: "$$ROOT" } } },
              { $project: { _id: 0, type: "$_id", options: 1 } },
              { $sort: { "options.option.order": 1 } },
            ],
            as: "optionVariants",
          },
        },
      ]);

      products.forEach((product) => {
        product.images =
          product?.images?.map((img) => {
            if (img.provider === ImageProviders.fileSystem)
              img.url = `${process.env.FILE_API}/${img.url}`;
            return img;
          }) || [];
      });

      // console.log(products);

      return resS.send(res, "Fetched Successfully !", products);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  //Add New Product
  Create: async (req, res, next) => {
    const sessionProduct = await Product.startSession();
    const sessionOptionVariant = await OptionVariant.startSession();
    const sessionProductOptionVariant =
      await ProductOptionVariant.startSession();
    const sessionInventory = await Inventory.startSession();

    sessionProduct.startTransaction();
    sessionOptionVariant.startTransaction();
    sessionProductOptionVariant.startTransaction();
    sessionInventory.startTransaction();

    try {
      const {
        skuCode,
        name,
        description,
        catId,
        subCatId,
        subSubCatId,
        brandId,
        shipId,
        optionVariants,
        productOptionVariants,
      } = JSON.parse(req.body.data);

      const code = await generateSequenceFromType(ProductCodeSequence);

      const productData = await Product.create({
        skuCode,
        code,
        name,
        description,
        catId,
        subCatId,
        subSubCatId,
        brandId,
        shipId,
        images:
          req?.files?.map((f, fi) => {
            return {
              // url: `uploads/${f?.fieldname}/${f?.filename}`, // When uploading file to filesystem.
              url: parsePathFromFileObject(f), // When uploading file to AWS S3 Bucket
              order: fi + 1,
            };
          }) || [],
        createdBy: req?.user || null,
        updatedBy: req?.user || null,
      });

      const optVarData = await OptionVariant.create(
        optionVariants.map((optVar) => ({
          ...optVar,
          productId: productData?._id || "",
          createdBy: req?.user || null,
          updatedBy: req?.user || null,
        }))
      );

      const productOptVarData = await ProductOptionVariant.create(
        productOptionVariants.map((prodOptVar) => ({
          ...prodOptVar,
          productId: productData?._id || "",
          createdBy: req?.user || null,
          updatedBy: req?.user || null,
        }))
      );

      prodOptVarInvMap = productOptionVariants.forEach((pov, povI) => {
        productOptVarData[povI].quantity = pov?.quantity || 0;
      });

      await Inventory.create(
        productOptVarData.map((p) => ({
          productOptionVariantId: p?._id,
          quantity: p?.quantity || 0,
          createdBy: req?.user?._id || null,
          updatedBy: req?.user?._id || null,
        }))
      );

      await trackUpload(req, res, req.files);

      await sessionProduct.commitTransaction();
      await sessionOptionVariant.commitTransaction();
      await sessionProductOptionVariant.commitTransaction();
      await sessionInventory.commitTransaction();

      return resS.send(res, "Uploaded Successfully !", {});
    } catch (error) {
      console.log("Error while adding product", error);
      await sessionProduct.abortTransaction();
      await sessionOptionVariant.abortTransaction();
      await sessionProductOptionVariant.abortTransaction();
      await sessionInventory.abortTransaction();

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Product Update Data By Id
  GetUpdateDataById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const product = await Product.findOne(
        { _id: id, isDeleted: false },
        {
          createdAt: 0,
          updatedAt: 0,
          createdBy: 0,
          updatedBy: 0,
          _id: 0,
          _v: 0,
          isDeleted: 0,
        }
      ).lean();

      if (!product) throw createError.NotFound(`No Product Found`);

      delete product?.price?._id;

      const optionVariants = await OptionVariant.find(
        { productId: id, isDeleted: false },
        { _id: 1, name: 1, property: 1, optionId: 1 }
      )
        .populate("optionId", "_id order")
        .lean();

      const productOptionVariantsList = await ProductOptionVariant.find(
        { productId: id, isDeleted: false },
        { price: 1, optionVariantIds: 1 }
      )
        .populate({
          path: "optionVariantIds",
          select: "_id optionId",
          populate: {
            path: "optionId",
            select: "order",
          },
        })
        .lean();

      let inventoryMap = await Inventory.find(
        {
          productOptionVariantId: {
            $in: productOptionVariantsList.map((i) => i?._id),
          },
          isDeleted: false,
        },
        { _id: 0, productOptionVariantId: 1, quantity: 1 }
      ).lean();

      inventoryMap = inventoryMap.reduce((a, i) => {
        a[i?.productOptionVariantId] = i?.quantity || 0;
        return a;
      }, {});

      product.images = product?.images || [];

      product.images.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        return 0;
      });

      product.images =
        product?.images?.map((img) => {
          if (img.provider === ImageProviders.fileSystem)
            img.url = `${process.env.FILE_API}/${img.url}`;
          return img;
        }) || [];

      optionVariants.sort((a, b) => {
        if (a?.optionId?.order > b?.optionId?.order) return 1;
        else if (a?.optionId?.order < b?.optionId?.order) return -1;
        return 0;
      });

      productOptionVariantsList.forEach((prodOptVar) => {
        prodOptVar.optionVariantIds.sort((a, b) => {
          if (a?.optionId?.order > b?.optionId?.order) return 1;
          else if (a?.optionId?.order < b?.optionId?.order) return -1;
          return 0;
        });

        prodOptVar.optionVariantIds = prodOptVar.optionVariantIds.map(
          (obj) => obj._id
        );

        prodOptVar.quantity = inventoryMap[prodOptVar?._id] || 0;
      });

      const toSend = {
        ...product,
        ...optionVariants.reduce(
          (acc, optVar) => {
            const optId = optVar?.optionId?._id;
            acc["optionIds"][optId] = 1;
            acc["optionsVariantMap"][optId] =
              acc["optionsVariantMap"][optId] || [];
            acc["optionsVariantMap"][optId].push(optVar);
            return acc;
          },
          { optionIds: {}, optionsVariantMap: {} }
        ),
        productOptionVariantsList,
      };

      toSend.optionIds = Object.keys(toSend.optionIds);

      // console.log(toSend,'???');

      return resS.send(res, "Fetched Successfully !", toSend);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update Product
  Update: async (req, res, next) => {
    const sessionProduct = await Product.startSession();
    const sessionOptionVariant = await OptionVariant.startSession();
    const sessionProductOptionVariant =
      await ProductOptionVariant.startSession();

    sessionProduct.startTransaction();
    sessionOptionVariant.startTransaction();
    sessionProductOptionVariant.startTransaction();

    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      // console.log(req.files.length);

      const {
        skuCode,
        name,
        description,
        catId,
        subCatId,
        subSubCatId,
        brandId,
        shipId,
        price,
        optionVariants,
        productOptionVariants,
        imagesStatus,
      } = JSON.parse(req.body.data);

      const { existingImg, nonExistingImg } = imagesStatus.reduce(
        (a, status) => {
          if (status == 1) a["nonExistingImg"].push({ order: ++a["indexSeq"] });
          else if (status != 1 || status != 0)
            a["existingImg"][status] = ++a["indexSeq"];
          return a;
        },
        { existingImg: {}, nonExistingImg: [], indexSeq: 0 }
      );

      let { images = [] } = await Product.findOne(
        { _id: id },
        { _id: 0, images: 1 }
      ).lean();

      // Filtering unchanged images
      images = images.filter((img) => {
        img.order = existingImg[img._id];
        return img._id in existingImg;
      });

      images.push(...nonExistingImg);

      images.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        return 0;
      });

      images.forEach((img) => {
        if (!img?.url) {
          const f = req.files?.shift();
          // if (f) img.url = `uploads/${f?.fieldname}/${f?.filename}`; // When uploading to filesystem
          if (f) img.url = parsePathFromFileObject(f);
          else img.url = null;
        }
      });

      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            skuCode,
            name,
            description,
            catId,
            subCatId,
            subSubCatId,
            brandId,
            shipId,
            price,
            images,
            updatedBy: req?.user || null,
          },
        }
      );

      // Removing records which were removed from FE
      await OptionVariant.updateMany(
        {
          productId: id,
          isDeleted: false,
          _id: { $nin: optionVariants.map((o) => o._id) },
        },
        {
          $set: {
            isDeleted: true,
            updatedBy: req?.user || null,
          },
        }
      );

      // Updating one-by-one
      for (let ov = 0; ov < optionVariants.length; ov++) {
        const optVarId = optionVariants[ov]["_id"];
        delete optionVariants[ov]["_id"];

        await OptionVariant.updateOne(
          { _id: optVarId, productId: id },
          {
            $set: {
              ...optionVariants[ov],
              updatedBy: req?.user || null,
            },
          },
          { upsert: true }
        );
      }

      // Removing records which were removed from FE
      await ProductOptionVariant.updateMany(
        {
          productId: id,
          isDeleted: false,
          _id: {
            $nin: productOptionVariants.map((o) => o?._id).filter((o) => o),
          },
        },
        {
          $set: {
            isDeleted: true,
            updatedBy: req?.user || null,
          },
        }
      );

      // Insert New
      const newProdOptVariants = productOptionVariants.filter((o) => !o?._id);
      if (newProdOptVariants?.length)
        await ProductOptionVariant.create(
          newProdOptVariants.map((prodOptVar) => ({
            ...prodOptVar,
            productId: id,
            createdBy: req?.user || null,
            updatedBy: req?.user || null,
          }))
        );

      // Updating one-by-one
      const oldProdOptVariants = productOptionVariants.filter((o) => o?._id);
      for (let pov = 0; pov < oldProdOptVariants.length; pov++) {
        const optVarId = oldProdOptVariants[pov]["_id"];
        delete oldProdOptVariants[pov]["_id"];
        await ProductOptionVariant.updateOne(
          { _id: optVarId, productId: id, isDeleted: false },
          {
            $set: {
              ...oldProdOptVariants[pov],
              updatedBy: req?.user || null,
            },
          }
        );
      }

      if (req.files.length) await trackUpload(req, res, req.files);

      await sessionProduct.commitTransaction();
      await sessionOptionVariant.commitTransaction();
      await sessionProductOptionVariant.commitTransaction();

      return resS.send(res, "Updated Successfully !", {});
    } catch (error) {
      await sessionProduct.abortTransaction();
      await sessionOptionVariant.abortTransaction();
      await sessionProductOptionVariant.abortTransaction();

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Approve
  Approve: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            isApproved: !!req.body?.isApproved,
            updatedBy: req?.user || null,
          },
        }
      );

      return resS.send(res, "Approval Status Updated Successfully !", {});
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Delete Product By Id
  Delete: async (req, res, next) => {
    const sessionProduct = await Product.startSession();
    const sessionOptionVariant = await OptionVariant.startSession();
    const sessionProductOptionVariant =
      await ProductOptionVariant.startSession();
    const sessionInventory = await Inventory.startSession();

    sessionProduct.startTransaction();
    sessionOptionVariant.startTransaction();
    sessionProductOptionVariant.startTransaction();
    sessionInventory.startTransaction();

    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      await Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } }
      );

      await OptionVariant.updateMany(
        { productId: id, isDeleted: false },
        { $set: { isDeleted: true } }
      );

      const prodOptVarIds = await ProductOptionVariant.distinct("_id", {
        productId: id,
        isDeleted: false,
      });

      await ProductOptionVariant.updateMany(
        { productId: id, isDeleted: false },
        { $set: { isDeleted: true } }
      );

      await Inventory.updateMany(
        { productOptionVariantId: { $in: prodOptVarIds }, isDeleted: false },
        { $set: { isDeleted: true } }
      );

      await sessionProduct.commitTransaction();
      await sessionOptionVariant.commitTransaction();
      await sessionProductOptionVariant.commitTransaction();
      await sessionInventory.commitTransaction();

      return resS.send(res, "Deleted Successfully !", {});
    } catch (error) {
      await sessionProduct.abortTransaction();
      await sessionOptionVariant.abortTransaction();
      await sessionProductOptionVariant.abortTransaction();
      await sessionInventory.abortTransaction();

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // // Get Product By sub sub Category Id - NOT IN USE
  GetBySubSubCatId: async (req, res, next) => {
    try {
      const { subSubCatId } = req.params;
      if (!subSubCatId) throw createError.NotFound(`Product Id Not Found`);
      const data = await Product.find({ subSubCatId, isDeleted: false });
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // // Get Product By Sub Cat Id
  GetBySubCatId: async (req, res, next) => {
    try {
      const { subCatId } = req.params;
      if (!subCatId) throw createError.NotFound(`Sub CatId Not Found`);
      const data = await Product.find({ subCatId, isDeleted: false })
        .populate("catId", "_id  catName")
        .populate("subCatId", "_id subCatName");
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // // Get Product By Cat Id
  GetByCatId: async (req, res, next) => {
    try {
      const { catId } = req.params;
      if (!catId) throw createError.NotFound(`CatId Not Found`);
      const data = await Product.find({ catId, isDeleted: false })
        .populate("catId", "_id  catName")
        .populate("subCatId", "_id subCatName");
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
};
