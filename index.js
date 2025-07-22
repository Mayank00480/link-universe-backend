require('dotenv').config();
const connectDB = require('./utils/database');
const express = require('express');
const app = express();

connectDB()
  .then(() => {
    app.listen(3000 , () => {
        console.log('Server is running on port 3000');
        console.log('Database connected successfully');
    })
  })
  .catch(err => console.log('Database connection failed:', err));

