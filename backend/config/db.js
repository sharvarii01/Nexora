const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use in-memory MongoDB if the environment is development and URI is localhost
    if (process.env.NODE_ENV === 'development' && uri.includes('localhost')) {
      console.log('🔄 Starting local In-Memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('✅ In-Memory MongoDB started at:', uri);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
