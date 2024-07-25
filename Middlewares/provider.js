const Product = require('../Models/Product');

async function isProvider(req, res, next) {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.provider.toString() !== req.user.user_id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        next();
    } catch (error) {
        console.error('Provider authorization error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {isProvider};
