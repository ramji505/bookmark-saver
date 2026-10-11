const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmark_saver';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bookmarksRouter = require('./routes/bookmarks');
app.use('/api/bookmarks', bookmarksRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Root endpoint info
app.get('/', (req, res) => {
  res.send('Bookmark Saver Backend API is running. Access the frontend application on port 3001.');
});

// Database connection & Server start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`Bookmark Saver backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Starting server anyway so requests can return informative errors...');
    app.listen(PORT, () => {
      console.log(`Bookmark Saver backend running on port ${PORT} (without active DB connection)`);
    });
  });
