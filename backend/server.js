const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const applicationRoute = require("./routes/applicationRoute");
const cors = require("cors");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/applications", applicationRoute);

app.get("/", (req, res) => {
  res.send("Auth service running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
