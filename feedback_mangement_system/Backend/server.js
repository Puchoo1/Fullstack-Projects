const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  })
);

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically track submission date
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// JWT Middleware for Protected Routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Routes

// 1. Signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
  }
});

// 2. Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});

// 3. Feedback Submission
app.post('/api/feedbacks', async (req, res) => {
  const { title, category, details } = req.body;

  try {
    const newFeedback = new Feedback({ title, category, details });
    await newFeedback.save(); // Save data to MongoDB

    console.log("Feedback saved to the database:", newFeedback); // Log the saved data
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error("Error saving feedback:", error); // Log any errors
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// 4. Get All Feedbacks
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks', error });
  }
});

// 5. Protected Route (Dashboard Example)
app.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the dashboard!', user: req.user });
});


// 6. Delete Feedback
app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error });
  }
});


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
