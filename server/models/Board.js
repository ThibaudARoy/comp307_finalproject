const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
});

module.exports = mongoose.model("Board", BoardSchema);
