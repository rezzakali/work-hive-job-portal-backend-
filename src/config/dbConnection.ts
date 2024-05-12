import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_CONNECTION_URI;

    const DB_NAME = process.env.DB_NAME;

    await mongoose.connect(`${mongoURI}/${DB_NAME}`);

    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed!', error);
  }
};

export default dbConnection;
