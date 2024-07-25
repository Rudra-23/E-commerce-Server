const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: ['Electronics', 'Clothing', 'Books', 'Food', 'Beauty', 'Sports', 'Other']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        trim: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Provider is required'],
        trim: true,
        ref: 'Seller'
    }
}, {
    timestamps: true,
    collection: 'products' 
});

module.exports = mongoose.model('Product', productSchema)