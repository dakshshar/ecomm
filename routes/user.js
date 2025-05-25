const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const bcryptjs = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');
const jwt = require('jsonwebtoken');
const dbConnect = require('../db');  // <-- Make sure this is correct path and export

// Get current user (protected)
router.get('/', user_jwt, async (req, res) => {
  try {
    await dbConnect();

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await dbConnect();

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        msg: 'User already exists',
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: `https://gravatar.com/avatar/?s=200&d=retro`,
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(payload, process.env.jwtUserSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          msg: 'Error signing token',
        });
      }

      res.status(200).json({
        success: true,
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: 'Server error',
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'User does not exist. Please register.',
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid password',
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.jwtUserSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          msg: 'Error signing token',
        });
      }

      res.status(200).json({
        success: true,
        msg: 'User logged in',
        token,
        user,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
});

module.exports = router;
