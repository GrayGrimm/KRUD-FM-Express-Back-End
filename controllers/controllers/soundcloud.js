const express = require('express');
const axios = require('axios');
const router = express.Router();

// SoundCloud API configuration
const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const SOUNDCLOUD_CLIENT_SECRET = process.env.SOUNDCLOUD_CLIENT_SECRET;
const SOUNDCLOUD_API_BASE = 'https://api.soundcloud.com';

// Middleware to check if SoundCloud credentials are configured
const checkSoundCloudConfig = (req, res, next) => {
  if (!SOUNDCLOUD_CLIENT_ID || !SOUNDCLOUD_CLIENT_SECRET) {
    return res.status(500).json({ 
      error: 'SoundCloud API credentials not configured. Please set SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET environment variables.' 
    });
  }
  next();
};

// Get access token (required for most API calls)
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://api.soundcloud.com/oauth2/token', {
      grant_type: 'client_credentials',
      client_id: SOUNDCLOUD_CLIENT_ID,
      client_secret: SOUNDCLOUD_CLIENT_SECRET
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting SoundCloud access token:', error.message);
    throw new Error('Failed to authenticate with SoundCloud API');
  }
};

// Search tracks
router.get('/search', checkSoundCloudConfig, async (req, res) => {
  try {
    const { q, limit = 20, offset = 0, genres, tags } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const params = new URLSearchParams({
      q,
      limit,
      offset,
      client_id: SOUNDCLOUD_CLIENT_ID
    });

    if (genres) params.append('genres', genres);
    if (tags) params.append('tags', tags);

    const response = await axios.get(`${SOUNDCLOUD_API_BASE}/tracks?${params}`);
    
    res.json({
      success: true,
      data: response.data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: response.headers['x-total-count'] || response.data.length
      }
    });
  } catch (error) {
    console.error('SoundCloud search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search SoundCloud tracks',
      details: error.message 
    });
  }
});

// Get track by ID
router.get('/tracks/:id', checkSoundCloudConfig, async (req, res) => {
  try {
    const { id } = req.params;
    const params = new URLSearchParams({
      client_id: SOUNDCLOUD_CLIENT_ID
    });

    const response = await axios.get(`${SOUNDCLOUD_API_BASE}/tracks/${id}?${params}`);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('SoundCloud track fetch error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch track information',
      details: error.message 
    });
  }
});

// Get trending tracks
router.get('/trending', checkSoundCloudConfig, async (req, res) => {
  try {
    const { limit = 20, offset = 0, genre } = req.query;
    
    const params = new URLSearchParams({
      client_id: SOUNDCLOUD_CLIENT_ID,
      limit,
      offset
    });

    if (genre) params.append('genres', genre);

    const response = await axios.get(`${SOUNDCLOUD_API_BASE}/tracks?${params}&sort=hotness`);
    
    res.json({
      success: true,
      data: response.data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('SoundCloud trending tracks fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch trending tracks',
      details: error.message 
    });
  }
});

// Get genres
router.get('/genres', checkSoundCloudConfig, async (req, res) => {
  try {
    const params = new URLSearchParams({
      client_id: SOUNDCLOUD_CLIENT_ID
    });

    const response = await axios.get(`${SOUNDCLOUD_API_BASE}/genres?${params}`);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('SoundCloud genres fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch genres',
      details: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SoundCloud API integration is working',
    configured: !!(SOUNDCLOUD_CLIENT_ID && SOUNDCLOUD_CLIENT_SECRET)
  });
});

module.exports = router;