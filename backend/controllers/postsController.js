const postsService = require('../services/postsService');
const openaiService = require('../services/openaiService');
const memoryService = require('../services/memoryService');

const postsController = {
  // Parse LinkedIn posts for hiring mentions
  async parseLinkedInPosts(req, res) {
    try {
      const { keywords = ['hiring', 'job', 'position', 'opportunity'], limit = 50 } = req.query;
      
      const posts = await postsService.parseLinkedInPosts({
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: posts,
        count: posts.length
      });
    } catch (error) {
      console.error('Error parsing LinkedIn posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to parse LinkedIn posts',
        message: error.message
      });
    }
  },

  // Analyze posts for actionable content
  async analyzePosts(req, res) {
    try {
      const { posts } = req.body;
      
      const analysis = await postsService.analyzePosts(posts);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error analyzing posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze posts',
        message: error.message
      });
    }
  },

  // Extract contact info from posts
  async extractContactInfo(req, res) {
    try {
      const { postText, postUrl } = req.body;
      
      const contactInfo = await postsService.extractContactInfo(postText, postUrl);

      res.json({
        success: true,
        data: contactInfo
      });
    } catch (error) {
      console.error('Error extracting contact info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to extract contact info',
        message: error.message
      });
    }
  },

  // Find posts mentioning hiring
  async findHiringPosts(req, res) {
    try {
      const { 
        keywords = ['hiring', 'job', 'position', 'opportunity'], 
        industry, 
        location, 
        remote,
        limit = 50 
      } = req.query;
      
      const posts = await postsService.findHiringPosts({
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        industry,
        location,
        remote: remote === 'true',
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: posts,
        count: posts.length
      });
    } catch (error) {
      console.error('Error finding hiring posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find hiring posts',
        message: error.message
      });
    }
  },

  // Find recruiter posts
  async findRecruiterPosts(req, res) {
    try {
      const { 
        keywords = ['recruiter', 'talent', 'hiring'], 
        industry, 
        location,
        limit = 50 
      } = req.query;
      
      const posts = await postsService.findRecruiterPosts({
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        industry,
        location,
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: posts,
        count: posts.length
      });
    } catch (error) {
      console.error('Error finding recruiter posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find recruiter posts',
        message: error.message
      });
    }
  },

  // Take action on a post (DM, email, apply)
  async takeActionOnPost(req, res) {
    try {
      const { 
        postId, 
        action, 
        resumeId, 
        customMessage,
        userId 
      } = req.body;
      
      const result = await postsService.takeActionOnPost({
        postId,
        action, // 'dm', 'email', 'apply'
        resumeId,
        customMessage,
        userId
      });

      // Learn from the action
      if (userId) {
        await memoryService.learnFromAction(userId, {
          type: 'post_action',
          action: action,
          postId: postId,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: result,
        message: `Action '${action}' completed successfully`
      });
    } catch (error) {
      console.error('Error taking action on post:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to take action on post',
        message: error.message
      });
    }
  },

  // Get post interaction history
  async getPostHistory(req, res) {
    try {
      const { userId, limit = 50 } = req.query;
      
      const history = await postsService.getPostHistory(userId, parseInt(limit));

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error getting post history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get post history',
        message: error.message
      });
    }
  }
};

module.exports = postsController; 