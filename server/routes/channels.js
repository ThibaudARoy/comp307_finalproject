const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const Channel = require("../models/Channel");
const { isAuthenticated } = require("../middleware/auth");

router.post(
  "/boards/:boardId/channels",
  isAuthenticated(),
  async (req, res) => {
    try {
      const boardId = req.params.boardId;
      const name = req.body.name;

      const board = await Board.findById(boardId);
      if (!board) {
        return res.status(404).send("Board not found");
      }
      var newChannel = new Channel({
        name: name,
        board: boardId,
        members: board.members,
        //messages: req.body.messages
      });

      await newChannel.save();

      await Board.findByIdAndUpdate(boardId, {
        $push: { channels: newChannel._id },
      });

      // await Channel.updateMany(
      //    { _id: { $in: newChannel._id } },
      //   { $push: { members: req.body.members } }
      // );

      res.status(200).json({ newChannel });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

router.get("/boards/:boardId/channels", isAuthenticated(), async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findOne({
      _id: boardId,
      members: req.user._id,
    });

    if (board) {
      const channels = await Channel.find({ board: boardId });
      res.status(200).json(channels);
    } else {
      return res
        .status(403)
        .json({ message: "You are not a member of the board." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete(
  "/boards/:boardId/channels/:channelId",
  isAuthenticated(),
  async (req, res) => {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      const board = await Board.findById(channel.board);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      if (board.admin.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the owner of this board." });
      }

      await channel.deleteOne({ _id: channel._id });

      await Board.findByIdAndUpdate(board._id, {
        $pull: { channels: channelId },
      });

      res.status(200).json({ message: "Channel removed successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
