const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Your schema properties here
});

const User = mongoose.model("User", userSchema);

module.exports = User;
