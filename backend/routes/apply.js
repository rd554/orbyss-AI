const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');

// POST /api/apply/job - Apply to a specific job
router.post('/job', applyController.applyToJob);

// POST /api/apply/bulk - Bulk apply to multiple jobs
router.post('/bulk', applyController.bulkApply);

// GET /api/apply/status/:id - Get application status
router.get('/status/:id', applyController.getApplicationStatus);

// GET /api/apply/history - Get application history
router.get('/history', applyController.getApplicationHistory);

module.exports = router; 