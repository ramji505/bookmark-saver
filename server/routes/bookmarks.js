const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// GET all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bookmarks', error: error.message });
  }
});

// POST save a bookmark URL (Single core functionality)
router.post('/', async (req, res) => {
  try {
    let { url, title } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ message: 'A valid website URL is required.' });
    }

    url = url.trim();

    // Auto-prepend https:// if protocol is omitted
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid URL format.' });
    }

    if (!title || !title.trim()) {
      try {
        const parsed = new URL(url);
        title = parsed.hostname.replace(/^www\./i, '');
      } catch {
        title = url;
      }
    }

    const bookmark = new Bookmark({
      title: title.trim(),
      url
    });

    const savedBookmark = await bookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save bookmark', error: error.message });
  }
});

// DELETE a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bookmark', error: error.message });
  }
});

module.exports = router;
