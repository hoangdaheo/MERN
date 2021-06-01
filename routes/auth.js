//jshint esversion:8
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//* @route POST api/auth/register
//* @desc Register user
//* @access Public


router.post('/register' ,async (req,res)=>{
    const {username,password} = req.body;

    //Simple validation
    if(!username || !password){
        return res
        .status(400)
        .json({success:false, message: "Missing username or password"});
    }
        try {
            //check for existing username
            const user = await User.findOne({username: username});
            if (user){
                return res.status(400).json({success:false, message:" username already taken"});
            }

            //all good
            const hashedPassword = await argon2.hash(password);
            const newUser = new User({
                username: username,
                password: hashedPassword
            }); 
            await newUser.save();

            //! return token
            const accesToken = jwt.sign({userId: newUser._id},process.env.ACCESS_TOKEN_SECRET);
            res.json({success: true,message: "User created successfully",accesToken});
            mongoose.connection.close();
        } catch (error) {
            console.log(error.message);
            res.status(500).json({success: false,message:'Internal Server error'});
            mongoose.connection.close();
        }
    

});

//* @route POST api/auth/login
//* @desc Login user
//* @access Public

router.post('/login', async (req, res) => {
    const {username,password} = req.body;
    if(!username || !password){
        res
        .status(400)
        .json({success: false,message:'Invalid username or password'});
    }
    try {
        //check for existing username
        const findUser = await User.findOne({username: username});
        console.log(findUser);
        if(!findUser){
            res.status(400).json({success:false, message:"Incorrect username"});
        }
        //usernme found
        const passwordValid = await argon2.verify(findUser.password, password);
        if(!passwordValid){
            return res.status(400).json({success:false, message:"Incorrect password"});
        }
        //all good
        //!return accesToken
        const accesToken = jwt.sign({userId:findUser._id},process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({success:true, message:"Login ok", accesToken});   
        mongoose.connection.close();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false,message:'Internal Server error'});
        mongoose.connection.close();
    }
});


module.exports = router;