const mongoose = require('mongoose');


const consumerSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        required: [true, 'balance is required'],
        min: [0, 'Balance cannot be negative'],
        default: 0
    },
}, {
    timestamps: true,
    collection: 'consumers' 
}); 

module.exports = mongoose.model('Consumer', consumerSchema)