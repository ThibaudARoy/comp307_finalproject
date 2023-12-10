const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  pinned: { type: Boolean, default: false },
  pinnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

MessageSchema.index({ content: "text" });

module.exports = mongoose.model("Message", MessageSchema);
