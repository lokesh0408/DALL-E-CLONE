import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

// configure the cloudinary and upload the images there..
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// route to get all posts
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts }); // returning all the posts
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// route to create a post
router.route("/").post(async (req, res) => {
  try {
    // get all the data i.e. 'POST' coming from the frontend
    const { name, prompt, photo } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo); // upload the photo to the cloudinary and get the image url

    const newPost = await Post.create({
      // create a new post in a database with the help of that url..
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

export default router;
