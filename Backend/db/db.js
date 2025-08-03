const mongoose = require('mongoose');

function connectToDb() {
    const connectionOptions = {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    mongoose.connect(process.env.DB_CONNECT, connectionOptions)
        .then(() => {
            console.log('✅ Successfully connected to MongoDB');
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            console.log('⚠️  App will continue running but database features may not work');
        });

    // Handle connection events
    mongoose.connection.on('connected', () => {
        console.log('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('🚨 Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('🔌 Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
    });
}

module.exports = connectToDb;
