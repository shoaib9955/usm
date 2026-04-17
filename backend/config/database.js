import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Production-ready connection options
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Server selection timeout
      socketTimeoutMS: 45000, // Socket timeout
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
    });

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`Database disconnection error: ${error.message}`);
    process.exit(1);
  }
};

export default {
  connectDB,
  disconnectDB,
};

