const mongoose = require('mongoose');
async function connectToMongoDB(databaseUrl) {
    try {
        await mongoose.connect(databaseUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToMongoDB;
