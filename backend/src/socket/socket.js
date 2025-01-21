export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Sync user status
    socket.on("userStatusSync", () => {
      socket.broadcast.emit("updateUserStatus");
    });

    // Listen for new messages and broadcast them
    socket.on("newMessage", () => {
      console.log("message git");
      io.emit("messageReceived"); // Broadcast the new message to all clients
    });
  });
};
