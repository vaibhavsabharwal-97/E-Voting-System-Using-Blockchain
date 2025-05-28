import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Auth from "./Routes/AuthRoute.js";
import VoteRoute from "./Routes/vote.js";
import ElectionRoute from "./Routes/election.js";
import FeedbackRoute from "./Routes/feedback.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import ensureDirectories from "./utils/ensureDirectories.js";

dotenv.config();

const app = express();

// Ensure required directories exist
ensureDirectories();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));
app.use('/public', express.static('public'));

// Serve files from Faces directory
app.use('/Faces', express.static('Faces'));

// Configure file upload
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  useTempFiles: false,
  abortOnLimit: true,
  createParentPath: true // This will create parent directories if they don't exist
}));

app.use("/api/auth", Auth);
app.use("/api/vote", VoteRoute);
app.use("/api/election", ElectionRoute);
app.use("/api/feedback", FeedbackRoute);

// MongoDB connection string - use environment variable or default
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/evotingdb';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
    console.log("Connected to MongoDB at:", MONGO_URI);
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
    console.log("Please make sure MongoDB is running and the connection string is correct");
  });

app.listen(1322, () => {
  console.log("Server is running on port 1322");
});
