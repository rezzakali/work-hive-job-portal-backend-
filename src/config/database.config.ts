import mongoose from 'mongoose';
import config from './app.config';

const connectDatabase = async () => {
  try {
    const connectionString =
      config.NODE_ENV === 'production'
        ? config.MONGO_URI_ATLAS
        : config.MONGO_URI;
    await mongoose.connect(connectionString);
    console.log('Database connectied successfully!');
  } catch (error) {
    console.log('Database connection failed!');
    process.exit(1);
  }
};

export default connectDatabase;
