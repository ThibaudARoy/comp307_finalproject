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

  // Validate search term
  if (!searchTerm) {
    console.log("Search term is missing");
    return res.status(400).send("Search term is required");
  }

  try {
    // Fetch channels associated with the board
    console.log(`Fetching channels for board ID: ${boardId}`);
    const channels = await Channel.find({ board: boardId });

    // Handling no channels found
    if (channels.length === 0) {
      console.log(`No channels found for board ID: ${boardId}`);
      return res.status(404).send(`No channels found for board: ${boardId}`);
    }

    // Logging found channel IDs
    const channelIds = channels.map((channel) => channel._id);
    console.log(`Found channels - IDs: ${channelIds.join(", ")}`);

    // Perform the search in messages
    console.log(`Searching messages in channels for term: '${searchTerm}'`);
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
            from: "users", // The collection to join
            localField: "creator", // Field from the input documents
            foreignField: "_id", // Field from the documents of the "from" collection
            as: "creatorDetails", // Output array field
          },
        },
        {
          $unwind: "$creatorDetails", // Flatten the output
        },
        {
          $project: {
            _id: 1, // Include the message id
            content: 1, // Include the message content
            creatorDetails: { firstName: 1, lastName: 1 }, // Include specific fields from creatorDetails
          },
        },
      ])
      .toArray();

    //.populate("creator", "firstName lastName");

    // Handling no messages found
    if (messages.length === 0) {
      console.log("No messages found matching the search term");
      return res.status(404).send("No messages found matching your search");
    }

    // Respond with found messages
    console.log(`Found ${messages.length} message(s) matching the search term`);
    res.json(messages);
  } catch (error) {
    // Detailed error logging
    console.error("Error in /search/:boardId endpoint:", error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

module.exports = router;
