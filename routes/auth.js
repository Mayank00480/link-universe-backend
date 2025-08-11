const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users");
const { validateSignUp, validateLogin } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { emailId, password } = req.body;
    const checkUser = await User.find({emailId : emailId});
    if(checkUser?.length > 0){
      throw new Error("User already Exist")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailId: emailId,
      password: hashedPassword,
    });
    await user.save();
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
  res.json({ message: "User signed up successfully" });
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (isPasswordValid) {
      var token = user.getJWT();
      res.cookie("token", token);
      res.json({ message: "Login successful", data: user });
    }
  } catch (err) {
    return res.status(400).json({ message: "Error: " + err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

module.exports = authRouter;
