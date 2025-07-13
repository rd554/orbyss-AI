const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// GET /api/jobs/search - Search for jobs
router.get('/search', jobsController.searchJobs);

// GET /api/jobs/scrape - Scrape jobs from various platforms
router.get('/scrape', jobsController.scrapeJobs);

// GET /api/jobs/linkedin - Scrape LinkedIn jobs specifically
router.get('/linkedin', jobsController.scrapeLinkedInJobs);

// GET /api/jobs/angelist - Scrape AngelList jobs
router.get('/angellist', jobsController.scrapeAngelListJobs);

// GET /api/jobs/indeed - Scrape Indeed jobs
router.get('/indeed', jobsController.scrapeIndeedJobs);

// GET /api/jobs/glassdoor - Scrape Glassdoor jobs
router.get('/glassdoor', jobsController.scrapeGlassdoorJobs);

// GET /api/jobs/:id - Get specific job details
router.get('/:id', jobsController.getJobById);

// POST /api/jobs/apply - Apply to a job
router.post('/apply', jobsController.applyToJob);

// POST /api/jobs/bulk-apply - Apply to multiple jobs
router.post('/bulk-apply', jobsController.bulkApplyToJobs);

// GET /api/jobs/history - Get job application history
router.get('/history', jobsController.getJobHistory);

// DELETE /api/jobs/:id - Delete a job from history
router.delete('/:id', jobsController.deleteJob);

module.exports = router; 