import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
// https://www.restapitutorial.com/httpstatuscodes.html

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    console.log(postMessages);

    res.status(200).json(postMessages);
  } catch (error) {
    console.error(postMessages);

    res.status(404).json({ message: error.message });
  }
};

export const createPosts = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({ ...post, creator: req.userId });

  console.log(newPost);
  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send({ message: "Post id is invalid" });

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    },
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ message: "Post id is invalid" });

  const removedPost = await PostMessage.findByIdAndRemove(id);

  res.json(removedPost);
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req?.userId)
    return res.status(400).json({ message: "User Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send({ message: "Post id is invalid" });

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((userId) => userId === String(req.userId));

  if (index < 0) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((userId) => userId !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};
