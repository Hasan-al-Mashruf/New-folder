export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("userLogout", () => {
      socket.broadcast.emit("updateUserStatus");
    });
    socket.on("userLogin", () => {
      console.log("login");
      socket.broadcast.emit("updateUserStatus");
    });
    console.log("User connected:", socket.id);
  });
};
