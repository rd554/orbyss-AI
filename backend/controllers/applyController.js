const applyService = require('../services/applyService');

module.exports = {
  applyToJob: async (req, res) => {
    try {
      const { jobId, userId, applicationData } = req.body;
      const result = await applyService.applyToJob(jobId, userId, applicationData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  bulkApply: async (req, res) => {
    try {
      const { jobs, userId } = req.body;
      const result = await applyService.bulkApply(jobs, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getApplicationStatus: async (req, res) => {
    try {
      const { applicationId } = req.query;
      const result = await applyService.getApplicationStatus(applicationId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getApplicationHistory: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await applyService.getApplicationHistory(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}; 