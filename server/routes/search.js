const express = require("express");
const router = express.Router();
const Channel = require("../models/Channel");
const Message = require("../models/Message");
const mongoose = require("mongoose");

router.get("/search/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const searchTerm = req.query.q;

  // Initial logging for received parameters
  console.log(
    `Received search request - Board ID: ${boardId}, Search Term: '${searchTerm}'`
  );

  if (!searchTerm) {
    return res.status(400).send("Search term is required");
  }

  try {
    console.log(`Fetching channels for board ID: ${boardId}`);
    const channels = await Channel.find({ board: boardId });

    // Handling no channels found
    if (channels.length === 0) {
      return res.status(404).send(`No channels found for board: ${boardId}`);
    }

    const channelIds = channels.map((channel) => channel._id);

    // Perform the search in messages
    const messages = await mongoose.connection
      .collection("messages")
      .aggregate([
        {
          $match: {
            $text: { $search: searchTerm },
            channel: { $in: channelIds },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creatorDetails",
          },
        },
        {
          $unwind: "$creatorDetails",
        },
        {
          $addFields: {
            formattedTimestamp: {
              $dateToString: {
                format: "%b %d",
                date: "$timestamp",
                timezone: "UTC",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            timestamp: 1,
            formattedTimestamp: 1,
            channel: 1,
            creatorDetails: { firstName: 1, lastName: 1 },
          },
        },
      ])
      .toArray();

    if (messages.length === 0) {
      return res.status(404).send("No messages found matching your search");
    }

    // Respond with found messages
    console.log(`Found ${messages.length} message(s) matching the search term`);
    res.json(messages);
  } catch (error) {
    console.error("Error in /search/:boardId endpoint:", error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

module.exports = router;
