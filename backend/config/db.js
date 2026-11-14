const mongoose = require('mongoose');

let MongoMemoryServer = null;
let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Use in-memory MongoDB only in development with a localhost URI
    if (process.env.NODE_ENV !== 'production' && uri.includes('localhost')) {
      try {
        const mms = require('mongodb-memory-server');
        MongoMemoryServer = mms.MongoMemoryServer;
        console.log('🔄 Starting local In-Memory MongoDB server...');
        mongod = await MongoMemoryServer.create({
          instance: { launchTimeout: 60000 }
        });
        uri = mongod.getUri();
        console.log('✅ In-Memory MongoDB started at:', uri);
      } catch (e) {
        console.warn('⚠️  mongodb-memory-server not available, using URI as-is:', uri);
      }
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In serverless (Vercel), don't call process.exit — just throw
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw error;
    }
    process.exit(1);
  }
};

// Cache connection for serverless environments (Vercel)
let isConnected = false;

const connectDBCached = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await connectDB();
  isConnected = true;
};

module.exports = connectDBCached;
