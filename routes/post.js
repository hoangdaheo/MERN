//jshint esversion:8

const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const verifyToken = require("../middleware/auth");
const { findOneAndDelete } = require("../models/post");

//*@route GET api/posts
//*@desc get post
//*@access Private
router.get("/",verifyToken, async (req, res) => {
  try {
    const findPost = await Post.find({user : req.userId}).populate('user',['username','createdAt']);
    res.status(200).json({success:true,findPost});

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false,message:"Internal Server Error"});
  }
});



//*@route POST api/posts
//*@desc Create post
//*@access Private
router.post("/", verifyToken , async (req, res) => {
  const { title, description, url, status } = req.body;
  //simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "title is required" });
  }


  try {
    const newPost = new Post({
      title: title,
      description: description,
      url: url.startsWith('https://')? url: `https://${url}`,
      status: status || 'TO LEARN',
      user: req.userId
    });
    await newPost.save();
    res.json({success: true,message:"Happy learning",post:newPost});

  } catch (error) {
    console.log(error.message);
    res
    .status(500)
    .json({ 
        success: false, 
        message: "Internal server error" });
  }
});
//*@route PUT api/posts
//*@desc Update post
//*@access Private
router.put("/:id", verifyToken , async (req, res)=>{
  
  const {title, description, url, status} = req.body;
  console.log(title);
  if(!title){
    res.status(400).json({ success: false, message: "title is required" });
  }
  try {
    let updatedPost = {
      title: title,
      description: description,
      url: (url.startsWith('https://')? url: `https://${url}`) || " ",
      status: status || 'TO LEARN',
    };

    const postUpdateCondition = {_id: req.params.id, user: req.userId};
    updatedPost = await Post.findOneAndUpdate(postUpdateCondition,updatedPost,{new: true});
    if(!updatedPost){
      return res.status(401).json({success: false, message:"User not authorised to update"});
    }
    res.json({success: true, message:"User update ok",post:updatedPost});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:"Internal Server Error"});

  }
});

//*@route DELETE api/posts
//*@desc Delete post
//*@access Private
router.delete("/:id", verifyToken , async (req, res)=>{
  try {
    const postDeleteCondition = {_id: req.params.id, user: req.userId};
    const deletePost = await Post.findOneAndDelete(postDeleteCondition);
    if(!deletePost){
      return res.status(401).json({success:false,message:"User not authorised"});
    } 
    res.json({success:true,message:"Delete ok",post: deletePost});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false,message:"Internal Server Error"});
  }
});



module.exports = router;
