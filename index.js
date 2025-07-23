require('dotenv').config();
const connectDB = require('./utils/database');
const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');
const profileRouter = require('./routes/profile');
app.use(cookieParser());
app.use(express.json());
app.use(authRouter);
app.use(profileRouter);
connectDB()
  .then(() => {
    app.listen(3000 , () => {
        console.log('Server is running on port 3000');
        console.log('Database connected successfully');
    })
  })
  .catch(err => console.log('Database connection failed:', err));

