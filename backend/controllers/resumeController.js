const resumeService = require('../services/resumeService');

module.exports = {
  uploadResume: async (req, res) => {
    try {
      const userId = req.body.userId;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }
      const result = await resumeService.uploadResume(userId, file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getResume: async (req, res) => {
    try {
      const { userId, resumeId } = req.query;
      const result = await resumeService.getResume(userId, resumeId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  updateResume: async (req, res) => {
    try {
      const { userId, resumeId, resumeData } = req.body;
      const result = await resumeService.updateResume(userId, resumeId, resumeData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  tailorResume: async (req, res) => {
    try {
      const { userId, resumeId, jobDescription } = req.body;
      const result = await resumeService.tailorResume(userId, resumeId, jobDescription);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteResume: async (req, res) => {
    try {
      const { userId, resumeId } = req.body;
      const result = await resumeService.deleteResume(userId, resumeId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getResumeList: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await resumeService.getResumeList(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}; 