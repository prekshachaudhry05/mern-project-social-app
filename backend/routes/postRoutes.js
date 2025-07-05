const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all posts (Timeline)
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const friendIds = user.friends.map(id => id.toString());
  friendIds.push(req.user.id);

  const posts = await Post.find({ user: { $in: friendIds } })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(posts);
});

// Create a post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      image: req.file ? req.file.path : null
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this post' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }

    res.json({ message: 'Post liked', likes: post.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

// Unlike a post
router.post('/:id/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();

    res.json({ message: 'Post unliked', likes: post.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to unlike post' });
  }
});

// Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = { user: req.user.id, text: req.body.text };
    post.comments.push(comment);
    await post.save();

    res.json({ message: 'Comment added', comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to comment' });
  }
});

// Get full post details (with likes and comments)
router.get('/:id/details', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('likes', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load post details' });
  }
});

module.exports = router;
