const express = require('express');

const { isAuthenticated, isAuthorized } = require('../../Middlewares/auth');
const Consumer = require('../../Models/Consumer'); 
const Cart = require('../../Models/Cart');
const Order = require('../../Models/Order');

const router = express.Router();

router.get('/', isAuthenticated, isAuthorized('consumer'), (req, res) => {
    return res.status(200).json({user: req.user});
});


router.put('/add/balance', isAuthenticated, isAuthorized('consumer'), async (req, res) => {
    const user_id = req.user.user_id;
    const { amount } = req.body;

    if (amount < 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        const updatedConsumer = await Consumer.updateOne(
            { user_id },
            { $inc: { balance: amount } }
        );

        if (updatedConsumer.nModified === 0) {
            return res.status(404).json({ message: 'Consumer not found or not authorized to update' });
        }

        return res.status(200).json({ message: 'Amount updated' });
    } catch (error) {
        console.error('Error updating amount:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/carts', isAuthenticated, isAuthorized('consumer'), async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const carts = await Cart.find({ user_id: user_id });

        if (!carts.length) {
            return res.status(404).json({ message: 'No carts found' });
        }

        return res.status(200).json(carts);
    } catch (error) {
        console.error('Error retrieving carts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/orders', isAuthenticated, isAuthorized('consumer'), async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.user_id });


        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found' });
        }

        for(const order of orders) {
            await order.populate('products.product');
            await order.populate('address');
        }

        return res.status(200).json(orders);

    } catch (error) {
        console.error('Error retrieving orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});    

module.exports = router;
