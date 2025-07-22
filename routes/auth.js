const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/users');
const {validateSignUp , validateLogin} = require('../utils/validation');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
authRouter.post("/signup",async(req,res) => {
    try{
        validateSignUp(req);
        const { emailId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        console.log("yes1");
        const user = new User({
            emailId : emailId,
            password : hashedPassword
        });
        console.log("yes3");
        await user.save();
    }
    catch(err){
        return res.status(400).json({message: "Error: "+ err.message});
    }

  console.log(req.body);    
  res.json({message: "User signed up successfully"});
})

authRouter.post("/login",async(req,res) => {
    try{
        validateLogin(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId: emailId});
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            var token = jwt.sign({ _id: user._id }, 'Mayank@123');
            res.cookie('token', token);
            res.json({message: "Login successful"});
        
        }    
    }
    catch(err){
        return res.status(400).json({message: "Error: "+ err.message});
    }
})

// authRouter.post("/profile",async(req,res) => {
//     try{
    
//        const token = req.cookies.token;
//        const userData = jwt.verify(token, 'Mayank@123')
//        console.log(userData);
//        res.json({message: "Profile accessed successfully"});
//     }
//     catch(err){
//         return res.status(400).json({message: "Error: "+ err.message});
//     }
// })


module.exports = authRouter;