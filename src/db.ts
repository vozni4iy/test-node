import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let gfs: mongoose.mongo.GridFSBucket;
let db: mongoose.mongo.Db;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    db = conn.connection.db;

    gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads',
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', (err as Error).message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
  });
};

export { connectDB, gfs, db };
