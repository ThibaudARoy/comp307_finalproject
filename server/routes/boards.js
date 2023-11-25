const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const { isAuthenticated } = require("../middleware/auth");

router.post("/boards", isAuthenticated(), async (req, res) => {
  try {
    const newBoard = new Board({
      name: req.body.name,
      admin: req.user._id,
      members: [req.user._id],
    });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/boards", isAuthenticated(), async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/boards/:boardId", isAuthenticated(), async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    if (board.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this board" });
    }
    await board.remove();
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
