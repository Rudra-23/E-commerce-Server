const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        required: [true, 'Id is required']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer',
        required: [true, 'User id is required']
    },
    products: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Product',
        required: [true, 'Product is required']
    }],
    address: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Address',
        required: [true, 'Address is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    }
}, {
    timestamps: true,
    collection: 'orders'
});

module.exports = mongoose.model('Order', orderSchema)