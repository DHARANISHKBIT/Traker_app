const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: __dirname + '/.env' });

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Not found');
console.log('PORT:', process.env.PORT ? '✅ Loaded' : '❌ Not found');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Not found');

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", require("./routers/userRoute"));
app.use("/api/transactions", require("./routers/TranctionRoute"));
app.use("/api/reports", require("./routers/reportRoute"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
