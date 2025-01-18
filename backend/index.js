import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;

// cors congiguration...

const corsConfig = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

const server = createServer(app);
const io = new Server(server, {
  cors: {
    ...corsConfig,
  },
});

const users = [{ id: 1, name: "user 1" }];

// Middleware
app.use(cors({ ...corsConfig }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my server" });
});

app.get("/users", (req, res) => {
  res.json({ data: users });
});

app.post("/createUser", (req, res) => {
  const { name } = req.body;
  const user = users.find((user) => user.name === name);
  if (user) {
    res.json({ message: "User already exists" });
  } else {
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    // Emit the updated user list to all connected clients
    io.emit("userListUpdated", users);
    res.json({ message: "User created successfully" });
  }
});

//socket

io.on("connection", (socket) => {
  io.emit("greet", socket.id);
  console.log("a user connected", socket.id);
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
