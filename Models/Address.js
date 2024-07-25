const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal Code is required'],
      trim: true
    },
    resident : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Resident is required'],
    }
  }, {
    timestamps: true,
    collection: 'addresses'
  });

  module.exports = mongoose.model('Address', addressSchema)