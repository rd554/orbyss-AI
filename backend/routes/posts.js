const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// GET /api/posts/linkedin - Parse LinkedIn posts for hiring mentions
router.get('/linkedin', postsController.parseLinkedInPosts);

// GET /api/posts/analyze - Analyze posts for actionable content
router.get('/analyze', postsController.analyzePosts);

// POST /api/posts/extract - Extract contact info from posts
router.post('/extract', postsController.extractContactInfo);

// GET /api/posts/hiring - Find posts mentioning hiring
router.get('/hiring', postsController.findHiringPosts);

// GET /api/posts/recruiters - Find recruiter posts
router.get('/recruiters', postsController.findRecruiterPosts);

// POST /api/posts/action - Take action on a post (DM, email, apply)
router.post('/action', postsController.takeActionOnPost);

// GET /api/posts/history - Get post interaction history
router.get('/history', postsController.getPostHistory);

module.exports = router; 