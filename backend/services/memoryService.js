const fs = require('fs').promises;
const path = require('path');

class MemoryService {
  constructor() {
    this.memoryPath = path.join(__dirname, '../storage');
    this.userProfilesPath = path.join(this.memoryPath, 'userProfiles.json');
    this.jobHistoryPath = path.join(this.memoryPath, 'jobHistory.json');
    this.memoryVectorsPath = path.join(this.memoryPath, 'memoryVectors.json');
    this.init();
  }

  async init() {
    try {
      // Ensure storage directory exists
      await fs.mkdir(this.memoryPath, { recursive: true });
      
      // Initialize files if they don't exist
      await this.ensureFileExists(this.userProfilesPath, {});
      await this.ensureFileExists(this.jobHistoryPath, []);
      await this.ensureFileExists(this.memoryVectorsPath, {});
    } catch (error) {
      console.error('Error initializing memory service:', error);
    }
  }

  async ensureFileExists(filePath, defaultContent) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  }

  // User Profile Management
  async getUserProfile(userId) {
    try {
      const data = await fs.readFile(this.userProfilesPath, 'utf8');
      const profiles = JSON.parse(data);
      return profiles[userId] || this.getDefaultProfile();
    } catch (error) {
      console.error('Error getting user profile:', error);
      return this.getDefaultProfile();
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const data = await fs.readFile(this.userProfilesPath, 'utf8');
      const profiles = JSON.parse(data);
      
      profiles[userId] = {
        ...profiles[userId],
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      await fs.writeFile(this.userProfilesPath, JSON.stringify(profiles, null, 2));
      return profiles[userId];
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  getDefaultProfile() {
    return {
      preferences: {
        industries: [],
        jobTitles: [],
        locations: [],
        remote: true,
        salary: {
          min: 0,
          max: 0
        },
        experience: 'mid-level'
      },
      skills: [],
      experience: [],
      education: [],
      resume: '',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }

  // Job History Management
  async addJobToHistory(userId, jobData) {
    try {
      const data = await fs.readFile(this.jobHistoryPath, 'utf8');
      const history = JSON.parse(data);
      
      const jobEntry = {
        id: `${userId}_${Date.now()}`,
        userId,
        ...jobData,
        timestamp: new Date().toISOString()
      };

      history.push(jobEntry);
      await fs.writeFile(this.jobHistoryPath, JSON.stringify(history, null, 2));
      
      return jobEntry;
    } catch (error) {
      console.error('Error adding job to history:', error);
      throw error;
    }
  }

  async getJobHistory(userId, limit = 50) {
    try {
      const data = await fs.readFile(this.jobHistoryPath, 'utf8');
      const history = JSON.parse(data);
      
      return history
        .filter(job => job.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting job history:', error);
      return [];
    }
  }

  async updateJobStatus(jobId, status) {
    try {
      const data = await fs.readFile(this.jobHistoryPath, 'utf8');
      const history = JSON.parse(data);
      
      const jobIndex = history.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        history[jobIndex].status = status;
        history[jobIndex].lastUpdated = new Date().toISOString();
        
        await fs.writeFile(this.jobHistoryPath, JSON.stringify(history, null, 2));
        return history[jobIndex];
      }
      
      return null;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  // Learning and Recommendations
  async learnFromAction(userId, action) {
    try {
      const profile = await this.getUserProfile(userId);
      
      // Update preferences based on action
      if (action.type === 'job_search') {
        await this.updateSearchPreferences(profile, action);
      } else if (action.type === 'job_application') {
        await this.updateApplicationPreferences(profile, action);
      } else if (action.type === 'dm_sent') {
        await this.updateDMPreferences(profile, action);
      }

      // Save updated profile
      await this.updateUserProfile(userId, profile);
      
      return profile;
    } catch (error) {
      console.error('Error learning from action:', error);
      throw error;
    }
  }

  async updateSearchPreferences(profile, action) {
    const { query, location, industry, jobTitle } = action;
    
    // Update job titles
    if (jobTitle && !profile.preferences.jobTitles.includes(jobTitle)) {
      profile.preferences.jobTitles.push(jobTitle);
    }
    
    // Update industries
    if (industry && !profile.preferences.industries.includes(industry)) {
      profile.preferences.industries.push(industry);
    }
    
    // Update locations
    if (location && !profile.preferences.locations.includes(location)) {
      profile.preferences.locations.push(location);
    }
  }

  async updateApplicationPreferences(profile, action) {
    const { jobTitle, company, industry, status } = action;
    
    // Track successful applications
    if (status === 'applied') {
      if (!profile.preferences.jobTitles.includes(jobTitle)) {
        profile.preferences.jobTitles.push(jobTitle);
      }
      
      if (industry && !profile.preferences.industries.includes(industry)) {
        profile.preferences.industries.push(industry);
      }
    }
  }

  async updateDMPreferences(profile, action) {
    const { recruiterCompany, industry, response } = action;
    
    // Track successful DM responses
    if (response === 'positive') {
      if (industry && !profile.preferences.industries.includes(industry)) {
        profile.preferences.industries.push(industry);
      }
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      const history = await this.getJobHistory(userId, 100);
      
      const recommendations = {
        jobTitles: this.getTopJobTitles(history),
        industries: this.getTopIndustries(history),
        companies: this.getTopCompanies(history),
        locations: this.getTopLocations(history),
        skills: this.getRecommendedSkills(profile, history),
        searchQueries: this.generateSearchQueries(profile, history)
      };

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {};
    }
  }

  getTopJobTitles(history) {
    const titles = {};
    history.forEach(job => {
      if (job.title) {
        titles[job.title] = (titles[job.title] || 0) + 1;
      }
    });
    
    return Object.entries(titles)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([title]) => title);
  }

  getTopIndustries(history) {
    const industries = {};
    history.forEach(job => {
      if (job.industry) {
        industries[job.industry] = (industries[job.industry] || 0) + 1;
      }
    });
    
    return Object.entries(industries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([industry]) => industry);
  }

  getTopCompanies(history) {
    const companies = {};
    history.forEach(job => {
      if (job.company) {
        companies[job.company] = (companies[job.company] || 0) + 1;
      }
    });
    
    return Object.entries(companies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([company]) => company);
  }

  getTopLocations(history) {
    const locations = {};
    history.forEach(job => {
      if (job.location) {
        locations[job.location] = (locations[job.location] || 0) + 1;
      }
    });
    
    return Object.entries(locations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location]) => location);
  }

  getRecommendedSkills(profile, history) {
    // Analyze job descriptions to extract required skills
    const skills = new Set();
    
    history.forEach(job => {
      if (job.description) {
        // Simple keyword extraction (in production, use NLP)
        const keywords = job.description.toLowerCase().match(/\b(javascript|python|react|node|aws|docker|kubernetes|sql|mongodb|redis|git|agile|scrum|leadership|management|communication|analytics|data|ml|ai|blockchain|fintech|saas|startup)\b/g);
        if (keywords) {
          keywords.forEach(skill => skills.add(skill));
        }
      }
    });
    
    return Array.from(skills);
  }

  generateSearchQueries(profile, history) {
    const queries = [];
    
    // Generate queries based on user preferences and history
    profile.preferences.jobTitles.forEach(title => {
      profile.preferences.industries.forEach(industry => {
        queries.push(`${title} ${industry}`);
      });
    });
    
    // Add location-based queries
    profile.preferences.locations.forEach(location => {
      profile.preferences.jobTitles.forEach(title => {
        queries.push(`${title} ${location}`);
      });
    });
    
    return queries.slice(0, 10);
  }

  // Memory Vectors for Advanced Learning
  async storeMemoryVector(userId, vector) {
    try {
      const data = await fs.readFile(this.memoryVectorsPath, 'utf8');
      const vectors = JSON.parse(data);
      
      if (!vectors[userId]) {
        vectors[userId] = [];
      }
      
      vectors[userId].push({
        ...vector,
        timestamp: new Date().toISOString()
      });
      
      // Keep only recent vectors (last 1000)
      if (vectors[userId].length > 1000) {
        vectors[userId] = vectors[userId].slice(-1000);
      }
      
      await fs.writeFile(this.memoryVectorsPath, JSON.stringify(vectors, null, 2));
    } catch (error) {
      console.error('Error storing memory vector:', error);
      throw error;
    }
  }

  async getMemoryVectors(userId, limit = 100) {
    try {
      const data = await fs.readFile(this.memoryVectorsPath, 'utf8');
      const vectors = JSON.parse(data);
      
      return vectors[userId] || [];
    } catch (error) {
      console.error('Error getting memory vectors:', error);
      return [];
    }
  }

  // Behavioral Analysis
  async analyzeBehavior(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      const history = await this.getJobHistory(userId);
      const vectors = await this.getMemoryVectors(userId);
      
      const analysis = {
        applicationRate: this.calculateApplicationRate(history),
        responseRate: this.calculateResponseRate(history),
        preferredPlatforms: this.getPreferredPlatforms(history),
        activeHours: this.getActiveHours(vectors),
        searchPatterns: this.analyzeSearchPatterns(history),
        successFactors: this.analyzeSuccessFactors(history)
      };
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      return {};
    }
  }

  calculateApplicationRate(history) {
    const totalSearches = history.filter(job => job.action === 'search').length;
    const totalApplications = history.filter(job => job.action === 'apply').length;
    
    return totalSearches > 0 ? (totalApplications / totalSearches) * 100 : 0;
  }

  calculateResponseRate(history) {
    const applications = history.filter(job => job.action === 'apply');
    const responses = applications.filter(job => job.response === 'positive');
    
    return applications.length > 0 ? (responses.length / applications.length) * 100 : 0;
  }

  getPreferredPlatforms(history) {
    const platforms = {};
    history.forEach(job => {
      if (job.platform) {
        platforms[job.platform] = (platforms[job.platform] || 0) + 1;
      }
    });
    
    return Object.entries(platforms)
      .sort(([,a], [,b]) => b - a)
      .map(([platform, count]) => ({ platform, count }));
  }

  getActiveHours(vectors) {
    const hours = new Array(24).fill(0);
    
    vectors.forEach(vector => {
      if (vector.timestamp) {
        const hour = new Date(vector.timestamp).getHours();
        hours[hour]++;
      }
    });
    
    return hours;
  }

  analyzeSearchPatterns(history) {
    const patterns = {
      commonQueries: this.getTopJobTitles(history),
      timeOfDay: this.getActiveHours(history.map(job => ({ timestamp: job.timestamp }))),
      frequency: this.calculateSearchFrequency(history)
    };
    
    return patterns;
  }

  analyzeSuccessFactors(history) {
    const successfulJobs = history.filter(job => job.status === 'applied' && job.response === 'positive');
    
    return {
      successfulIndustries: this.getTopIndustries(successfulJobs),
      successfulCompanies: this.getTopCompanies(successfulJobs),
      successfulJobTitles: this.getTopJobTitles(successfulJobs)
    };
  }

  calculateSearchFrequency(history) {
    const searches = history.filter(job => job.action === 'search');
    const timeSpan = searches.length > 1 ? 
      new Date(searches[searches.length - 1].timestamp) - new Date(searches[0].timestamp) : 0;
    
    return timeSpan > 0 ? searches.length / (timeSpan / (1000 * 60 * 60 * 24)) : 0; // searches per day
  }
}

module.exports = new MemoryService(); 