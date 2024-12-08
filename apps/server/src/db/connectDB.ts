import mongoose from "mongoose";

// Database Connection
const DB_URL = process.env.DB_URL;

export default async function mongoConnect() {
  if (!DB_URL) {
    throw new Error("DB URL is not defined in the environment variables.");
  }

  try {
    // Remove deprecated options and add recommended ones
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "accountil",
    };

    await mongoose.connect(DB_URL, mongooseOptions);
    console.log('Connected to MongoDB successfully');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Remove deprecated settings
  // mongoose.set("useFindAndModify", false); // Removed as it's no longer needed in newer versions
  // mongoose.set("useCreateIndex", true);    // Removed as it's no longer needed in newer versions
}

// Error handling for mongoose
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});