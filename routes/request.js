const express = require("express");
const User = require("../models/users");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/userAuth");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params || {};
    const fromUserId = req.user._id;
    const allowedStatuses = ["interested", "ignored"];
    const isStatusValid = allowedStatuses.includes(status);
    if (!isStatusValid) {
      return res.status(400).json({ message: "Invalid status provided" });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (toUserId.toString() === fromUserId.toString()) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }
    const existingRequest = await ConnectionRequest.findOne({
        $or : [
            {fromUserId : toUserId , toUserId : fromUserId},
            {fromUserId , toUserId}
        ]
    })
    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already exists" });
    }
    const request = new ConnectionRequest({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: status,
    });
    console.log(toUser);
    await request.save();
    return res.json({
      message: `Connection request sent successfully from ${req.user.firstName} to ${toUser.firstName} with status: ${status}`,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req, res) => {
  try {
    const allowedStatuses = ["accepted", "rejected"];
    const { status, requestId } = req.params || {};
    const isStatusValid = allowedStatuses.includes(status);
    if (!isStatusValid) {
      throw new Error("Invalid status provided");
    }
    const request = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId : req.user._id,
        status : "interested"
    })
    if(!request) {
       throw new Error("Connection request not found or already processed");
    }
    request.status = status;
    await request.save();
    res.json({
      message: `Connection request ${status} successfully`,
      data: request,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

module.exports = requestRouter;
