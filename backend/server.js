import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router as userRoutes } from "./src/routes/users.js";
import { router as messageRoutes } from "./src/routes/messages.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketHandler } from "./src/socket/socket.js";
dotenv.config();

const app = express();

// assets
const port = process.env.PORT;
const dbUrl = process.env.MONGO_URI;

// cors congiguration...
const corsConfig = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

//socket configuration
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { ...corsConfig },
});

// Middleware
app.use(cors({ ...corsConfig }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Socket.io

socketHandler(io);

// connect to db
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my server" });
});
