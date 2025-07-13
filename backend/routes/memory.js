const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

// GET /api/memory/profile - Get user profile
router.get('/profile', memoryController.getUserProfile);

// PUT /api/memory/profile - Update user profile
router.put('/profile', memoryController.updateUserProfile);

// GET /api/memory/recommendations - Get personalized recommendations
router.get('/recommendations', memoryController.getRecommendations);

// GET /api/memory/behavior - Get behavioral analysis
router.get('/behavior', memoryController.getBehaviorAnalysis);

// POST /api/memory/learn - Learn from user action
router.post('/learn', memoryController.learnFromAction);

module.exports = router; 