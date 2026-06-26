const user = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


// Generate JWT Token
const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};


// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    // Check Existing User
    const existingUser = await user.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create User
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword
    });

    if (newUser) {

      // Generate OTP
      /*const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Email Message
      const message = `
      Welcome to Shopnest, ${name}!

      Thank you for registering with us.

      Your OTP for Shopnest registration is:
      ${otp}
      `;

      // Send Email
      await sendEmail(
        email,
        'Shopnest Registration OTP',
        message
      );
*/

      // Response
      res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      });

    } else {

      res.status(400).json({
        message: 'Invalid user data'
      });
    }

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Login User
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const existingUser = await user.findOne({ email });

    if (
      existingUser &&
      (await bcrypt.compare(
        password,
        existingUser.password
      ))
    ) {

      res.json({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token: generateToken(existingUser._id),
      });

    } else {

      res.status(400).json({
        message: 'Invalid email or password'
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Get User
const getUser = async (req, res) => {

  try {

    const existingUser = await user
      .findById(req.user.id)
      .select('-password');

    if (existingUser) {

      res.json(existingUser);

    } else {

      res.status(404).json({
        message: 'User not found'
      });
    }

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await user.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
};