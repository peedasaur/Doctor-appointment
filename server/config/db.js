const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('Check if your MongoDB instance is running and accessible.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
