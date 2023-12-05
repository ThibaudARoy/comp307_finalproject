const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
console.log("Secret Key:", process.env.SECRET_OR_KEY);
console.log("Secret Key:", process.env.MONGODB_URI);


const app = express();
const httpServer = require('http').createServer(app);

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
app.use("/api/", usersRouter);
app.use("/api/", boardsRouter);
app.use("/api/", membersRouter);
app.use("/api/", messagesRouter);
app.use("/api/", channelRouter);

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.json({ message: "Server is connected test" });
});



const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  },
  pingTimeout: 60 * 1000,
})

const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, socket.request.res, next);
io.use(wrapMiddlewareForSocketIo(passport.initialize()));

io.use((socket, next) => {

  passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
          return next(new Error('Authentication error: Invalid token'));
      }

      socket.user = user;
      return next();
  })(socket.handshake, {}, next);
});


io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("setup", (message) => {
    socket.emit("connected");
  });

  // We can write our socket event listeners in here...
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
