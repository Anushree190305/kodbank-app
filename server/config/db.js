const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ MongoDB Connection Refused');
      console.error('   MongoDB is not running. Please start MongoDB first:');
      console.error('   • Windows: Run "mongod" or start MongoDB service');
      console.error('   • Or install MongoDB: https://www.mongodb.com/try/download/community\n');
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
