const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const { validateProfileUpdate } = require("../utils/validation");
const User = require("../models/users");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ message: "Profile accessed successfully", data: user });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    validateProfileUpdate(req);
    const user = req.user;
    const updateUser = await User.findByIdAndUpdate(user._id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });
    return res.json({
      message: "Profile updated successfully",
      data: updateUser,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

module.exports = profileRouter;
