import mongoose from "mongoose";

//Connect to MongoDB database
const connectDB = async () => {
  try {
    // use the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log successful connection with the host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any connection errors
    console.error(error);
  }
};

export default connectDB;