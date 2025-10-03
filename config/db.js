const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const error = new Error('MONGODB_URI environment variable is not set');
    console.error(error.message);
    throw error;
  }

  try {
    // Set mongoose options for serverless
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(uri, { 
      dbName: process.env.DB_NAME || undefined,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
}

module.exports = { connectDB };
