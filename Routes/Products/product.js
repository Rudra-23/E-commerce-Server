const express = require('express');
const mongoose = require('mongoose');
const Product = require('./../../Models/Product'); 
const { isAuthenticated, isAuthorized } = require('./../../Middlewares/auth');
const { isProvider } = require('./../../Middlewares/provider');
const router = express.Router();

// GET: all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// POST: a new product
router.post('/product', isAuthenticated, isAuthorized('seller'), async (req, res) => {
    const { name, price, description, category, stock } = req.body;

    const validCategories = ['Electronics', 'Clothing', 'Books', 'Food', 'Beauty', 'Sports', 'Other'];

    if (!name || !price || !description || !validCategories.includes(category) || stock === undefined) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const newProduct = new Product({
        name,
        price,
        description,
        category,
        stock,
        provider: req.user.user_id
    });

    try {
        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error saving product:', error);
        return res.status(400).json({ message: 'Failed to create product' });
    }
});


// GET: a single product by id
router.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error retrieving product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// PATCH: a single product by id
router.patch('/product/:id', isAuthenticated, isAuthorized('seller'), isProvider, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Invalid values for product or not authorized to update' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to update product' });
    }
});


// DELETE: a single product by id
router.delete('/product/:id', isAuthenticated, isAuthorized('seller'), isProvider, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found or not authorized to delete' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
