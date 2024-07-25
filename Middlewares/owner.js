const Cart = require('../Models/Cart');

async function isOwner(req, res, next) {
    const { id } = req.params;

    try {
        const cart = await Cart.findById(id);

        if (!cart) {
            return res.status(404).json({ message: 'cart not found' });
        }

        if (cart.user_id.toString() !== req.user.user_id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to access this cart' });
        }

        next();
    } catch (error) {
        console.error('Provider authorization error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {isOwner};