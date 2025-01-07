import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_CONNECTION_URI;

    const DB_NAME = process.env.DB_NAME;

    await mongoose.connect(`${mongoURI}/${DB_NAME}`);

    // const collection = mongoose.connection.collection('jobs');

    // const result = await collection.updateMany(
    //   {},
    //   {
    //     $set: {
    //       createdBy: new mongoose.Types.ObjectId('669e6640081a76068c5e4ae9'),
    //     },
    //   }
    // );

    // console.log('Documents updated:', result.modifiedCount);

    // // Close the connection after the update
    // mongoose.connection.close();

    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed!', error);
  }
};

export default dbConnection;
