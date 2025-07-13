const memoryService = require('../services/memoryService');

module.exports = {
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await memoryService.getUserProfile(userId);
      res.json({ success: true, profile: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const { userId, profileData } = req.body;
      const result = await memoryService.updateUserProfile(userId, profileData);
      res.json({ success: true, message: 'User profile updated', result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getRecommendations: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await memoryService.getRecommendations(userId);
      res.json({ success: true, recommendations: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getBehaviorAnalysis: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await memoryService.getBehaviorAnalysis(userId);
      res.json({ success: true, analysis: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  learnFromAction: async (req, res) => {
    try {
      const { userId, action } = req.body;
      const result = await memoryService.learnFromAction(userId, action);
      res.json({ success: true, message: 'Learned from action', result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}; 