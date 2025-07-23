const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 6,
    maxLength: 20,
  },
  lastName: {
    type: String,
    minLength: 6,
    maxLength: 20,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default : "https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121231710-stock-illustration-male-default-avatar-profile-gray.jpg",
    validate(value) {
      if (!validator?.isURL(value)) {
        throw new Error("Invalid URL");
      }
    },
  },
  skills: {
    type: [String],
    validate(value) {
      if (value.length > 5) {
        throw new Error("Skills array cannot have more than 5 skills");
      }
    },
  },
  about: {
    type: String,
    minLength: 10,
    maxLength: 200,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "others"],
      message: "{VALUE} is not a valid gender",
    },
  },
} , {
  timestamps: true
});

userSchema.methods.getJWT = function () {
  const user = this;
  var token = jwt.sign({ _id: user._id }, "Mayank@123");
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
