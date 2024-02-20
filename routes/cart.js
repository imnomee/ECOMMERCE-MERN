const router = require('express').Router();
const {
    verifyToken,
    verifyTokenAndAuth,
    verifyTokenAndAdmin,
} = require('../routes/verifyToken');
const CryptoJS = require('crypto-js');
const Cart = require('../models/Cart');

//CREATE
router.post('/', verifyToken, async (req, res) => {
    const cart = new Cart(req.body);
    console.log(cart);

    try {
        const savedCart = await cart.save();
        return res.status(201).json(savedCart);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

//UPDATE
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        return res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json('cartPut: ', err);
    }
});

//DELETE
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart deleted');
    } catch (err) {
        return res.status(500).json('cartDelete: ', err.message);
    }
});

//GET
router.get('/find/:userId', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json('cartGet: ', err);
    }
});

//Get All
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        return res.status(200).json(carts);
    } catch (err) {
        return res.status(500).json('getAllCart: ', err);
    }
});

module.exports = router;
