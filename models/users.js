const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        minLength : 6,
        maxLength : 20
    },
    lastName : {
        type : String,
        minLength : 6,
        maxLength : 20
    },
    emailId: {
        type : String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address');
            }
        }
    },
    password:{
        type : String,
        required: true
    },
    photoUrl : {
        type : String,
        validate(value){
            if(!validator?.isURL(value)){
                throw new Error('Invalid URL');
            }
        }
    }
})


const User = mongoose.model('User', userSchema);
module.exports = User;