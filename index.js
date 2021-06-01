//jshint esversion:8
require('dotenv').config();
const express = require('express');

const app = express();

const mongoose = require('mongoose');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth.js');
const connectDB = async ()=>{
    try {
        const option = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        const urlConnection = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.qqn6g.mongodb.net/mern-learnit?retryWrites=true&w=majority`;
        await mongoose.connect(urlConnection,option);
        console.log("M connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
connectDB();
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);
const PORT = 5000;
app.listen(PORT,()=>console.log("E Started on Port :5000"));
