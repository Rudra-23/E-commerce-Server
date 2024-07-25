const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer',
        required: [true, 'Consumer is required']
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            min: [1, 'Quantity cannot be non positive'],
            required: [true, 'Quantity is required']
        }
    }],
    amount: {
        type: Number
    }
}, {
    timestamps: true,
    collection: 'cart'
});



cartSchema.pre('save', function(next) {
    this.amount = this.products.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    next();
});


module.exports = mongoose.model('Cart', cartSchema)