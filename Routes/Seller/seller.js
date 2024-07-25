const express = require('express');
const Product = require('./../../Models/Product'); 
const { isAuthenticated, isAuthorized } = require('./../../Middlewares/auth');

const router = express.Router();

router.get('/', isAuthenticated, isAuthorized('seller'), (req, res) => {
    if (req.user) {
        return res.status(200).json(req.user);
    } else {
        return res.status(401).send('Seller not authenticated');
    }
});

router.get('/products', isAuthenticated, isAuthorized('seller'), async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const products = await Product.find({ provider: user_id });

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;