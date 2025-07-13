const jobsService = require('../services/jobsService');
const openaiService = require('../services/openaiService');
const memoryService = require('../services/memoryService');

const jobsController = {
  // Search for jobs based on criteria
  async searchJobs(req, res) {
    try {
      // If a prompt is provided, use OpenAI to parse it
      let searchParams;
      let parsedCommand = null;
      if (req.query.prompt) {
        parsedCommand = await openaiService.parseCommand(req.query.prompt);
        // Use parsedCommand fields if available, fallback to query params
        searchParams = {
          query: parsedCommand.query || req.query.query,
          location: parsedCommand.location || req.query.location,
          remote: typeof parsedCommand.remote === 'boolean' ? parsedCommand.remote : req.query.remote === 'true',
          industry: parsedCommand.industry || req.query.industry,
          experience: parsedCommand.experience || req.query.experience
        };
      } else {
        searchParams = {
          query: req.query.query,
          location: req.query.location,
          remote: req.query.remote === 'true',
          industry: req.query.industry,
          experience: req.query.experience
        };
      }
      const jobs = await jobsService.searchJobs(searchParams);
      res.json({
        success: true,
        data: jobs,
        count: jobs.length,
        parsedCommand // for debugging, can be removed later
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search jobs',
        message: error.message
      });
    }
  },

  // Scrape jobs from various platforms
  async scrapeJobs(req, res) {
    try {
      const { platforms = ['linkedin', 'angelist'], query, location } = req.query;
      
      const results = await jobsService.scrapeMultiplePlatforms({
        platforms: Array.isArray(platforms) ? platforms : [platforms],
        query,
        location
      });

      res.json({
        success: true,
        data: results,
        summary: {
          total: results.reduce((sum, platform) => sum + platform.jobs.length, 0),
          platforms: results.map(p => ({ name: p.platform, count: p.jobs.length }))
        }
      });
    } catch (error) {
      console.error('Error scraping jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to scrape jobs',
        message: error.message
      });
    }
  },

  // Scrape LinkedIn jobs specifically
  async scrapeLinkedInJobs(req, res) {
    try {
      const { query, location, remote, experience } = req.query;
      
      const jobs = await jobsService.scrapeLinkedInJobs({
        query,
        location,
        remote: remote === 'true',
        experience
      });

      res.json({
        success: true,
        data: jobs,
        count: jobs.length,
        platform: 'linkedin'
      });
    } catch (error) {
      console.error('Error scraping LinkedIn jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to scrape LinkedIn jobs',
        message: error.message
      });
    }
  },

  // Scrape AngelList jobs
  async scrapeAngelListJobs(req, res) {
    try {
      const { query, location, remote, funding } = req.query;
      
      const jobs = await jobsService.scrapeAngelListJobs({
        query,
        location,
        remote: remote === 'true',
        funding
      });

      res.json({
        success: true,
        data: jobs,
        count: jobs.length,
        platform: 'angellist'
      });
    } catch (error) {
      console.error('Error scraping AngelList jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to scrape AngelList jobs',
        message: error.message
      });
    }
  },

  // Scrape Indeed jobs
  async scrapeIndeedJobs(req, res) {
    try {
      const { query, location, remote, salary } = req.query;
      
      const jobs = await jobsService.scrapeIndeedJobs({
        query,
        location,
        remote: remote === 'true',
        salary
      });

      res.json({
        success: true,
        data: jobs,
        count: jobs.length,
        platform: 'indeed'
      });
    } catch (error) {
      console.error('Error scraping Indeed jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to scrape Indeed jobs',
        message: error.message
      });
    }
  },

  // Scrape Glassdoor jobs
  async scrapeGlassdoorJobs(req, res) {
    try {
      const { query, location, remote, rating } = req.query;
      
      const jobs = await jobsService.scrapeGlassdoorJobs({
        query,
        location,
        remote: remote === 'true',
        rating
      });

      res.json({
        success: true,
        data: jobs,
        count: jobs.length,
        platform: 'glassdoor'
      });
    } catch (error) {
      console.error('Error scraping Glassdoor jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to scrape Glassdoor jobs',
        message: error.message
      });
    }
  },

  // Get specific job details
  async getJobById(req, res) {
    try {
      const { id } = req.params;
      
      const job = await jobsService.getJobById(id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Error getting job by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get job details',
        message: error.message
      });
    }
  },

  // Apply to a job
  async applyToJob(req, res) {
    try {
      const { jobId, resumeId, coverLetter, customMessage } = req.body;
      
      const result = await jobsService.applyToJob({
        jobId,
        resumeId,
        coverLetter,
        customMessage
      });

      res.json({
        success: true,
        data: result,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      console.error('Error applying to job:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply to job',
        message: error.message
      });
    }
  },

  // Bulk apply to multiple jobs
  async bulkApplyToJobs(req, res) {
    try {
      const { jobIds, resumeId, coverLetter, customMessage } = req.body;
      
      const results = await jobsService.bulkApplyToJobs({
        jobIds,
        resumeId,
        coverLetter,
        customMessage
      });

      res.json({
        success: true,
        data: results,
        summary: {
          total: jobIds.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      });
    } catch (error) {
      console.error('Error bulk applying to jobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk apply to jobs',
        message: error.message
      });
    }
  },

  // Get job application history
  async getJobHistory(req, res) {
    try {
      const { userId } = req.query;
      
      const history = await jobsService.getJobHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error getting job history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get job history',
        message: error.message
      });
    }
  },

  // Delete a job from history
  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      
      await jobsService.deleteJob(id);

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete job',
        message: error.message
      });
    }
  }
};

module.exports = jobsController; 