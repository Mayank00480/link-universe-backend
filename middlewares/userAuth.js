const User = require("../models/users");
const jwt = require("jsonwebtoken"); 
const userAuth = async (req,res,next) => {
  try{
    const {token} = req.cookies;
    const hiddenData = jwt.verify(token, 'Mayank@123');
    const {_id} = hiddenData;
    const user = await User.findById(_id).select("firstName lastName age gender photoUrl skills about");
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
  }
  catch(err) {
    return res.status(401).json({message: "Error: "+ err.message});
  }
}

module.exports = userAuth;