const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();
console.log("Secret Key:", process.env.SECRET_OR_KEY);
console.log("Secret Key:", process.env.MONGODB_URI);

const app = express();

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
const channelRouter = require('./routes/channels');
app.use("/api/auth/", usersRouter);
app.use("/api/", boardsRouter);
app.use("/api/", membersRouter);
app.use("/api/", messagesRouter);
app.use("/api/", channelRouter);

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.json({ message: "Server is connected test" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
