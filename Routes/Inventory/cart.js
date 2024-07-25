const Product = require('../../Models/Product'); 
const { isAuthenticated, isAuthorized } = require('../../Middlewares/auth');
const Cart = require('../../Models/Cart');
const { isOwner } = require('../../Middlewares/owner');
const express = require('express');
const router = express.Router();

router.post('/', isAuthenticated, isAuthorized('consumer'), async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const newCart = new Cart({
            user_id: user_id
        });

        const savedCart = await newCart.save();
        return res.status(201).json({ message: 'Cart created successfully', cart: savedCart });
    } catch (error) {
        console.error('Error creating cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', isAuthenticated, isAuthorized('consumer'), isOwner, async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;

    try {
        const cart = await Cart.findOne({ _id: cart_id, user_id: user_id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', isAuthenticated, isAuthorized('consumer'), isOwner, async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;

    try {
        const cart = await Cart.findOneAndDelete({ _id: cart_id, user_id: user_id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found or not authorized to delete' });
        }

        return res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:id/item', isAuthenticated, isAuthorized('consumer'), isOwner, async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;
    const {product_id, quantity} = req.body;

    try {
        // Find the product
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user has enough balance
        if (req.user.balance < product.price * quantity) {
            return res.status(400).json({ message: 'Not enough balance' });
        }

        // Check if enough stock is available
        if (quantity > product.stock) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        // Find and update the cart
        const cart = await Cart.findOne({ _id: cart_id, user_id: user_id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Update the cart with the new product
        cart.products.push({ product: product, quantity: quantity });

        await cart.populate('products.product');
        await cart.save();

        return res.status(200).json({ message: 'Product added to cart', item_id: cart.products[cart.products.length - 1]._id });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.patch('/:id/item/:pid', isAuthenticated, isAuthorized('consumer'), isOwner, async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;
    const item_id = req.params.pid;
    const new_quantity = req.body.quantity;

    try {
        // Find the cart
        if (new_quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const cart = await Cart.findOne({ _id: cart_id, user_id: user_id });

        console.log(cart);
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.products.findIndex(item => item._id.toString() === item_id);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the quantity;
        cart.products[itemIndex].quantity = new_quantity;

        // Save the updated cart
        await cart.populate('products.product');

        await cart.save();

        return res.status(200).json({ message: 'Product quantity updated' });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/:id/item/:pid', isAuthenticated, isAuthorized('consumer'), isOwner, async (req, res) => {
    const user_id = req.user.user_id;
    const cart_id = req.params.id;
    const product_id = req.params.pid;

    try {
        // Find the cart
        const cart = await Cart.findOne({ _id: cart_id, user_id: user_id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product from the cart
        const productIndex = cart.products.findIndex(item => item._id.toString() === product_id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);
        await cart.populate('products.product');

        await cart.save();

        return res.status(200).json({ message: 'Product deleted from cart' });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;