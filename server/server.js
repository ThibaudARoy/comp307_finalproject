const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
const Message = require("./models/Message");
const Channel = require("./models/Channel");
const User = require("./models/User");
console.log("Secret Key:", process.env.SECRET_OR_KEY);
console.log("Secret Key:", process.env.MONGODB_URI);

const app = express();
const httpServer = require("http").createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// DB Config
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Routes
const usersRouter = require("./routes/users");
const boardsRouter = require("./routes/boards");
const membersRouter = require("./routes/members");
const messagesRouter = require("./routes/messages");
const channelRouter = require("./routes/channels");
const searchRouter = require("./routes/search");
app.use("/api/", searchRouter);
app.use("/api/", usersRouter);
app.use("/api/", boardsRouter);
app.use("/api/", membersRouter);
app.use("/api/", messagesRouter);
app.use("/api/", channelRouter);

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
  pingTimeout: 60 * 1000,
});

const wrapMiddlewareForSocketIo = (middleware) => (socket, next) =>
  middleware(socket.request, socket.request.res, next);
io.use(wrapMiddlewareForSocketIo(passport.initialize()));

io.use((socket, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = user;
    return next();
  })(socket.handshake, {}, next);
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.user._id}`);
  socket.on("setup", (message) => {
    socket.emit("connected");
  });

  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    console.log(`User joined channel ${channelId}`);
  });

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
    console.log(`User joined board ${boardId}`);
  });

  socket.on("deleteMessage", ({ channelId, messageId }) => {
    io.to(channelId).emit("messageDeleted", messageId);
  });

  socket.on("newMessage", (populatedMessage) => {
    const { channel } = populatedMessage;
    io.to(channel).emit("newMessage", populatedMessage);
  });

  socket.on("newChannel", async ({ channelToAdd, boardId }) => {
    const newChannel = await Channel.findById(channelToAdd);
    io.to(boardId).emit("newChannel", newChannel);
  });

  socket.on("deleteChannel", async ({ channelToDelete, boardId }) => {
    console.log("Delete id " + channelToDelete);
    io.to(boardId).emit("deleteChannel", channelToDelete);
  });

  socket.on("newBoard", async (newBoard) => {
    io.emit("newBoard", newBoard);
  });

  socket.on("deleteBoard", async (boardToDelete) => {
    io.emit("deleteBoard", boardToDelete);
  });
  socket.on("leaveChannel", (channelId) => {
    socket.leave(channelId);
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
