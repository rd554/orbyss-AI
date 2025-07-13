const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// POST /api/resume/upload - Upload resume
router.post('/upload', upload.single('resume'), resumeController.uploadResume);

// GET /api/resume/:id - Get resume by ID
router.get('/:id', resumeController.getResume);

// PUT /api/resume/:id - Update resume
router.put('/:id', resumeController.updateResume);

// POST /api/resume/tailor - Tailor resume for specific job
router.post('/tailor', resumeController.tailorResume);

// DELETE /api/resume/:id - Delete resume
router.delete('/:id', resumeController.deleteResume);

// GET /api/resume/list - Get all resumes for user
router.get('/list', resumeController.getResumeList);

module.exports = router; 