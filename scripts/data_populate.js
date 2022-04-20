
require('../src/utilities/dbConnection');
const Sequence = require('../src/models/Sequence');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const SubCategory = require('../src/models/SubCategory');
const Option = require('../src/models/Option');
const OptionV = require('../src/models/OptionVariant');
const ProductOptionVariant = require('../src/models/ProductOptionVariant');
const Inventory = require('../src/models/Inventory');
const { ProductCodeSequence } = require('../src/utilities/constants/sequence');
const User = require('../src/models/User');
const Color = require('../src/models/Color');
const Shipment = require('../src/models/Shipment');
const { ShipmentType } = require('../src/utilities/constants/shipment');

async function insertCat() {
    return await Category.create({
        name: 'Mobile & Accessories'
    });
}

async function insertSubCat() {
    // const cat = await insertCat();
    const cat = { _id: "61bde67d37accd9674894183" };
    return await SubCategory.create({
        name: 'Cover & Cases',
        catId: cat._id
    });
}

async function insertShipment() {
    return await Shipment.create({
        name: 'Sky Blue',
        type: ShipmentType.cost,
        value: 250,
        createdBy: '61cc27db6037ef888dec02b9',
        updatedBy: '61cc27db6037ef888dec02b9',
    });
}

async function insertSequence() {
    await Sequence.create({
        type: 'product_code',
        prefix: 'L',
        count: 17,
        minLength: 7,
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertProduct() {
    let { count, prefix, fill, minLength } = await Sequence.findOneAndUpdate(
        { key: ProductCodeSequence },
        { $inc: { count: 1 } },
        { new: true }
    );

    console.log(`${prefix}${(count + 1).toString().padStart(minLength, fill)}`);

    // const subCat = await insertSubCat();
    const subCat = {
        catId: "61bde67d37accd9674894183",
        _id: "61bde879525a2b7c557225ed"
    };

    console.log(subCat);

    await Product.create({
        code: `${prefix}${(count + 1).toString().padStart(minLength, fill)}`,
        name: 'iPhone 11 (TPU | Matte Black)',
        description: 'Spigen Liquid Air Back Cover Case Compatible with iPhone 11 (TPU | Matte Black)',
        // image: { type: [ImageSchema] },
        catId: subCat.catId,
        subCatId: subCat._id,
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertOption() {
    await Option.create({
        type: 'color',
        name: 'Color',
        order: 1,
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertOptionVariant() {
    await OptionV.create({
        name: `Blue`,
        property: {
            colorCode: '#0000ff'
        },
        optionId: '61bdea1bf5fbfc8f6306e7d7',
        productId: '61bde879525a2b7c557225ef',
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertProductOptionVariant() {
    await ProductOptionVariant.create({
        price: {
            actualPrice: 500.00,
            discountPricePercent: 449.00
        },
        optionVariantIds: ['61bdeba90950b9ed220af685', '61bdeaedfe3ab4cb512ed743'],
        productId: '61bde879525a2b7c557225ef',
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertInventory() {
    await Inventory.create({
        quantity: 12,
        productOptionVariantId: '61bdf84c48fff5ded103479c',
        createdBy: '61b351366770025f8052eb10',
        updatedBy: '61b351366770025f8052eb10'
    });
}

async function insertUser() {
    await User.create({
        email
            :
            "admin_new@gmail.com",
        password
            :
            "admin",
        firstName
            :
            "Admin",
        lastName
            :
            "admin",
        address
            :
            "London",
        phone
            :
            "9911920067",
        isDeleted
            :
            false,
        role
            :
            '61af9953ff8f716cc1433a33',
    });
}

setTimeout(async () => {

    // insertProduct();
    // insertOption();
    // insertSequence();
    insertShipment();
    // insertOptionVariant();
    // insertProductOptionVariant();
    // insertInventory();

    // insertUser();

}, 3000);