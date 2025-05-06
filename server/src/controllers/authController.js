import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Assuming you have a User model
import dotenv from 'dotenv';

dotenv.config();


// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    // Retrieve only username and password from the request body.
    const { username, password } = req.body;

    // Debug: Log the request body (for development only).
    console.log('Received login request:', { username, password });

    // Find the user by username only.
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the DB.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate the JWT token.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });

    // Return both the token and the username.
    // This way, the client can store the username in localStorage and display it.
    res.json({ token, user: { username: user.username } });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};