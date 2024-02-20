const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin } = require('../routes/verifyToken');
const CryptoJS = require('crypto-js');
const Order = require('../models/Order');

//CREATE
router.post('/', verifyToken, async (req, res) => {
    const order = new Order(req.body);
    console.log(order);

    try {
        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        return res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json('orderPut: ', err);
    }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted');
    } catch (err) {
        return res.status(500).json('orderDelete: ', err.message);
    }
});

//GET
router.get('/find/:userId', verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json('orderGet: ', err);
    }
});

//Get All
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json('getAllOrder: ', err);
    }
});

module.exports = router;
