import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router as userRoutes } from "./src/routes/users.js";
dotenv.config();

// cors congiguration...
const corsConfig = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

// assets
const port = process.env.PORT;
const dbUrl = process.env.MONGO_URI;
const app = express();

// Middleware
app.use(cors({ ...corsConfig }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my server" });
});

// connect to db
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
