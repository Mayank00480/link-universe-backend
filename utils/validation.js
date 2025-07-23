const validator = require('validator');

const validateSignUp = (req) => {
    if(!validator?.isStrongPassword(req.body.password)){
            throw new Error('Password is not strong enough');
    }
   validateLogin(req);
}

const validateLogin = (req) => {
   const allowedFields = ['emailId', 'password'];    
   const isValidFields = Object.keys(req.body).every(key => allowedFields.includes(key));
   if(!isValidFields){
         throw new Error('Invalid fields in request body');
   } 
}

const validateProfileUpdate = (req) => {
   const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'skills', 'about'];
   const isValidFields = Object.keys(req.body).every(key => allowedFields.includes(key));
   if(!isValidFields){
         throw new Error('Invalid fields in request body');
   }
}

module.exports = {validateSignUp, validateLogin , validateProfileUpdate};