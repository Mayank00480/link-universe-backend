require('dotenv').config();
const connectDB = require('./utils/database');
const express = require('express');
const cors= require('cors');
const app = express();
const authRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);
connectDB()
  .then(() => {
    app.listen(3000 , () => {
        console.log('Server is running on port 3000');
        console.log('Database connected successfully');
    })
  })
  .catch(err => console.log('Database connection failed:', err));

