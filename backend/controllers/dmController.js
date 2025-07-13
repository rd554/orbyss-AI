const dmService = require('../services/dmService');

module.exports = {
  sendDM: async (req, res) => {
    try {
      const { userId, recipientId, message } = req.body;
      const result = await dmService.sendDM(userId, recipientId, message);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  bulkSendDM: async (req, res) => {
    try {
      const { userId, recipients, message } = req.body;
      const result = await dmService.bulkSendDM(userId, recipients, message);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getDMHistory: async (req, res) => {
    try {
      const { userId } = req.query;
      const result = await dmService.getDMHistory(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getDMStatus: async (req, res) => {
    try {
      const { dmId } = req.query;
      const result = await dmService.getDMStatus(dmId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}; 