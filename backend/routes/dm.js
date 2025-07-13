const express = require('express');
const router = express.Router();
const dmController = require('../controllers/dmController');

// POST /api/dm/send - Send DM to recruiter
router.post('/send', dmController.sendDM);

// POST /api/dm/bulk - Send bulk DMs
router.post('/bulk', dmController.bulkSendDM);

// GET /api/dm/history - Get DM history
router.get('/history', dmController.getDMHistory);

// GET /api/dm/status/:id - Get DM status
router.get('/status/:id', dmController.getDMStatus);

module.exports = router; 