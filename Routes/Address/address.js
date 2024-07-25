const express = require('express');
const router = express.Router();

const Address = require('../../Models/Address');
const {isAuthenticated} = require('../../Middlewares/auth');

// GET: Retrieve all addresses
router.get('/', isAuthenticated, async (req, res) => {
    const user_id = req.user._id;

    try {
        const addresses = await Address.find({ resident: user_id });
        return res.status(200).json(addresses);
    } catch (error) {
        console.error('Error retrieving addresses:', error);
        return res.status(400).json({ error: error.message });
    }
});

// POST: Create a new address
router.post('/', isAuthenticated, async (req, res) => {
    const user_id = req.user._id;
    const address = new Address({
        ...req.body,
        resident: user_id
    });

    try {
        const savedAddress = await address.save();
        return res.status(201).json({ address_id: savedAddress._id });
    } catch (error) {
        console.error('Error saving address:', error);
        return res.status(400).json({ error: error.message });
    }
});

// PUT: Update an existing address
router.put('/address/:id', isAuthenticated, async (req, res) => {
    const user_id = req.user._id;
    const addressId = req.params.id;

    try {
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, resident: user_id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: 'Address not found or not authorized to update' });
        }

        return res.status(200).json({message: 'Address updated successfully'});
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(400).json({ error: error.message });
    }
});


// DELETE: Delete an existing address
router.delete('/address/:id', isAuthenticated, async (req, res) => {
    const user_id = req.user._id;
    const addressId = req.params.id;

    try {
        const deletedAddress = await Address.findOneAndDelete({ _id: addressId, resident: user_id });

        if (!deletedAddress) {
            return res.status(404).json({ error: 'Address not found or not authorized to delete' });
        }

        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
