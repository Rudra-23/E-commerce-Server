const Product = require('../../Models/Product'); 
const { isAuthenticated, isAuthorized } = require('../../Middlewares/auth');
const Consumer = require('../../Models/Consumer'); 
const Cart = require('../../Models/Cart');
const Address = require('../../Models/Address');
const Order = require('../../Models/Order');
const Seller = require('../../Models/Seller');

const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

router.post('/:id', isAuthenticated, isAuthorized('consumer'), async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;
    const { address_id } = req.body;

    const session = await mongoose.startSession();

    try {
        // Validate address
        const address = await Address.findOne({ _id: address_id, resident: user_id });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Validate cart
        const cart = await Cart.findOne({ _id: cart_id, user_id: user_id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (cart.amount > req.user.balance) {
            return res.status(400).json({ message: 'Not enough balance' });
        }

        if (cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Validate stock
        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (!product || item.quantity > product.stock) {
                return res.status(400).json({ message: 'Not enough stock for one or more products' });
            }
        }

        session.startTransaction();
        // Create order
        const newOrder = new Order({
            user_id,
            products: cart.products,
            address,
            amount: cart.amount
        });

        await cart.populate('products.product');
        // Update product stock and seller earnings
        for (const item of cart.products) {
            
            await Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } });
            await Seller.updateOne({ user_id: item.product.provider }, { $inc: { balance: item.quantity * item.product.price } });
        }

        // Update consumer balance and delete cart
        await Consumer.updateOne({ user_id }, { $inc: { balance: -cart.amount } });
        await Cart.findByIdAndDelete(cart_id);

        await newOrder.populate('products.product');
        await newOrder.populate('address');

        await newOrder.save();

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: 'Order created successfully', order_id: newOrder._id });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;