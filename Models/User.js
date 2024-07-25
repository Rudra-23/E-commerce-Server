const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    age: {
        type: Number
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['consumer', 'seller'],
        default: 'consumer'
    }
}, {
    timestamps: true,
    collection: 'users' 
});

module.exports = mongoose.model('User', userSchema);
