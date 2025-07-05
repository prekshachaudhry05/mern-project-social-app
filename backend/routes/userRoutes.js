const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Register (no verification)
router.post('/register', async (req, res) => {
  const { name, email, password, description } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashed,
      description: description || '',
      avatar: ''
    });

    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration failed");
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Incorrect password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
});



// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('requestsSent', 'name avatar');
  res.json(user);
});
;

// Update profile (with avatar removal and upload support)
router.put('/profile', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const updates = {
      name: req.body.name,
      description: req.body.description || ''
    };

    // Remove avatar if requested
    if (req.body.removeAvatar === 'true') {
      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }
      updates.avatar = '';
    }

    // Upload new avatar
    if (req.file) {
      updates.avatar = req.file.path;

      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Profile update failed");
  }
});

// Send Friend Request
router.post('/send-request/:id', authMiddleware, async (req, res) => {
  const sender = await User.findById(req.user.id);
  const receiver = await User.findById(req.params.id);

  if (!receiver || sender.friends.includes(receiver._id)) return res.status(400).send("Invalid request");

  if (!receiver.requestsReceived.includes(sender._id)) {
    receiver.requestsReceived.push(sender._id);
    sender.requestsSent.push(receiver._id);
    await sender.save();
    await receiver.save();
  }

  res.send("Friend request sent");
});

// Accept Friend Request
router.post('/accept-request/:id', authMiddleware, async (req, res) => {
  const receiver = await User.findById(req.user.id);
  const sender = await User.findById(req.params.id);

  receiver.friends.push(sender._id);
  sender.friends.push(receiver._id);

  receiver.requestsReceived = receiver.requestsReceived.filter(id => id.toString() !== sender._id.toString());
  sender.requestsSent = sender.requestsSent.filter(id => id.toString() !== receiver._id.toString());

  await receiver.save();
  await sender.save();

  res.send("Friend request accepted");
});

// Reject Friend Request
router.post('/reject-request/:id', authMiddleware, async (req, res) => {
  const receiver = await User.findById(req.user.id);
  const sender = await User.findById(req.params.id);

  receiver.requestsReceived = receiver.requestsReceived.filter(id => id.toString() !== sender._id.toString());
  sender.requestsSent = sender.requestsSent.filter(id => id.toString() !== receiver._id.toString());

  await receiver.save();
  await sender.save();

  res.send("Friend request rejected");
});

// Get Friend List
router.get('/my-friends', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('friends', 'name avatar');
  res.json(user.friends);
});

// Get Request Received
router.get('/requests-received', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('requestsReceived', 'name avatar');
  res.json(user.requestsReceived);
});

// Get All Users (Suggestions)
router.get('/all-users', authMiddleware, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select('name avatar');
  res.json(users);
});

// Remove a friend
router.post('/remove-friend/:id', authMiddleware, async (req, res) => {
  const me = await User.findById(req.user.id);
  const other = await User.findById(req.params.id);

  me.friends = me.friends.filter(f => f.toString() !== other._id.toString());
  other.friends = other.friends.filter(f => f.toString() !== me._id.toString());

  await me.save();
  await other.save();

  res.send("Friend removed");
});

// GET /api/users/:id (Other user's profile)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('User not found');

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate('user', 'name avatar');
    const friends = await User.find({ _id: { $in: user.friends } }).select('name avatar');

    res.json({ user, posts, friends });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE /api/users/delete
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Optionally: Delete user's avatar file
    if (user.avatar && fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    // Optionally: delete user's posts
    await Post.deleteMany({ user: user._id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.send('Account deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete account');
  }
});



module.exports = router;
