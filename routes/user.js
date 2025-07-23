const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/users");
const userRouter = express.Router();
const userData = "firstName lastName age gender photoUrl skills about";
userRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    })
      .populate("fromUserId", userData)
      .select("fromUserId");

    res.json({
      message: "Received connection requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", userData)
      .populate("toUserId", userData);

    const connectionResult = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched successfully",
      data: connectionResult,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });
    const hiddenUserIds = new Set();
    connections.forEach((connection) => {
      hiddenUserIds.add(connection.fromUserId.toString());
      hiddenUserIds.add(connection.toUserId.toString());
    });
    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserIds) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(userData)
      .skip(skip)
      .limit(limit);

    console.log(hiddenUserIds);
    res.json({
      message: "Feed fetched successfully",
      data: feed,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

module.exports = userRouter;
