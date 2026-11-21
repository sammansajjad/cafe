
const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Atlas connected successfully');
    }  
    catch (error) {
        console.error('MongoDB connection failed:', error.message);

        if (error.reason?.servers) {
            for (const [address, server] of error.reason.servers) {
                console.error('\nServer:', address);
                console.error('Server error:', server.error?.message || 'No specific error reported');
            }
        }

        process.exit(1);
    
    }
};

module.exports = connectDB;
