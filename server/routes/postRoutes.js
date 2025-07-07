const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('category');
  res.json(posts);
});

// GET single post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('category');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// CREATE post
router.post(
  '/',
  [
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('category').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  }
);

// UPDATE post
router.put('/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// DELETE post
router.delete('/:id', async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted' });
});

module.exports = router;
