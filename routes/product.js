const router = require('express').Router();
const {
    verifyTokenAndAuth,
    verifyTokenAndAdmin,
} = require('../routes/verifyToken');
const CryptoJS = require('crypto-js');
const Product = require('../models/Products');
const Products = require('../models/Products');

//CREATE PRODUCTS
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const product = new Product(req.body);
    console.log(product);

    try {
        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

//UPDATE PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        return res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json('userPut: ', err);
    }
});

//DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product deleted');
    } catch (err) {
        return res.status(500).json('productDelete: ', err.message);
    }
});

//GET PRODUCT
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json('productGet: ', err);
    }
});

//GET ALL PRODUCTS
router.get('/', async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;

    try {
        let products;
        if (queryNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (queryCategory) {
            products = await Product.find({
                category: { $in: [queryCategory] },
            });
        } else {
            products = await Products.find();
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json('productGetAll: ', err);
    }
});

module.exports = router;
