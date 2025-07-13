const { chromium } = require('playwright');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const openaiService = require('./openaiService');
const memoryService = require('./memoryService');

class JobsService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: false, // Set to true in production
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    if (!this.page) {
      this.page = await this.browser.newPage();
    }
    return this.page;
  }

  async closeBrowser() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Search jobs across multiple platforms
  async searchJobs({ query, location, remote, industry, experience }) {
    try {
      const platforms = ['linkedin', 'angellist', 'indeed'];
      const results = [];

      for (const platform of platforms) {
        try {
          const jobs = await this[`scrape${platform.charAt(0).toUpperCase() + platform.slice(1)}Jobs`]({
            query,
            location,
            remote,
            industry,
            experience
          });
          results.push(...jobs);
        } catch (error) {
          console.error(`Error scraping ${platform}:`, error);
        }
      }

      // Filter and rank results
      const filteredJobs = this.filterAndRankJobs(results, { query, location, remote, industry, experience });
      
      return filteredJobs;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  // Scrape multiple platforms
  async scrapeMultiplePlatforms({ platforms, query, location }) {
    const results = [];

    for (const platform of platforms) {
      try {
        const jobs = await this[`scrape${platform.charAt(0).toUpperCase() + platform.slice(1)}Jobs`]({
          query,
          location
        });
        
        results.push({
          platform,
          jobs,
          count: jobs.length
        });
      } catch (error) {
        console.error(`Error scraping ${platform}:`, error);
        results.push({
          platform,
          jobs: [],
          count: 0,
          error: error.message
        });
      }
    }

    return results;
  }

  // Scrape LinkedIn jobs
  async scrapeLinkedInJobs({ query, location, remote, experience }) {
    try {
      const page = await this.initBrowser();
      
      // Navigate to LinkedIn Jobs
      const searchUrl = this.buildLinkedInSearchUrl({ query, location, remote, experience });
      await page.goto(searchUrl);
      
      // Wait for job listings to load
      await page.waitForSelector('[data-testid="job-card-container"]', { timeout: 10000 });
      
      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('[data-testid="job-card-container"]');
        return Array.from(jobCards, (card, index) => {
          const titleElement = card.querySelector('[data-testid="job-card-title"]');
          const companyElement = card.querySelector('[data-testid="job-card-company"]');
          const locationElement = card.querySelector('[data-testid="job-card-location"]');
          const linkElement = card.querySelector('a');
          
          return {
            id: `linkedin_${index}`,
            title: titleElement?.textContent?.trim() || '',
            company: companyElement?.textContent?.trim() || '',
            location: locationElement?.textContent?.trim() || '',
            url: linkElement?.href || '',
            platform: 'linkedin',
            timestamp: new Date().toISOString()
          };
        }).slice(0, 20); // Limit to 20 jobs
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping LinkedIn jobs:', error);
      throw error;
    }
  }

  // Scrape AngelList jobs
  async scrapeAngelListJobs({ query, location, remote, funding }) {
    try {
      const page = await this.initBrowser();
      
      // Navigate to AngelList Jobs
      const searchUrl = this.buildAngelListSearchUrl({ query, location, remote, funding });
      await page.goto(searchUrl);
      
      // Wait for job listings to load
      await page.waitForSelector('.job-card', { timeout: 10000 });
      
      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.job-card');
        return Array.from(jobCards, (card, index) => {
          const titleElement = card.querySelector('.job-title');
          const companyElement = card.querySelector('.company-name');
          const locationElement = card.querySelector('.job-location');
          const linkElement = card.querySelector('a');
          
          return {
            id: `angellist_${index}`,
            title: titleElement?.textContent?.trim() || '',
            company: companyElement?.textContent?.trim() || '',
            location: locationElement?.textContent?.trim() || '',
            url: linkElement?.href || '',
            platform: 'angellist',
            timestamp: new Date().toISOString()
          };
        }).slice(0, 20);
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping AngelList jobs:', error);
      throw error;
    }
  }

  // Scrape Indeed jobs
  async scrapeIndeedJobs({ query, location, remote, salary }) {
    try {
      const page = await this.initBrowser();
      
      // Navigate to Indeed
      const searchUrl = this.buildIndeedSearchUrl({ query, location, remote, salary });
      await page.goto(searchUrl);
      
      // Wait for job listings to load
      await page.waitForSelector('.job_seen_beacon', { timeout: 10000 });
      
      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.job_seen_beacon');
        return Array.from(jobCards, (card, index) => {
          const titleElement = card.querySelector('.jobTitle');
          const companyElement = card.querySelector('.companyName');
          const locationElement = card.querySelector('.companyLocation');
          const linkElement = card.querySelector('a');
          
          return {
            id: `indeed_${index}`,
            title: titleElement?.textContent?.trim() || '',
            company: companyElement?.textContent?.trim() || '',
            location: locationElement?.textContent?.trim() || '',
            url: linkElement?.href || '',
            platform: 'indeed',
            timestamp: new Date().toISOString()
          };
        }).slice(0, 20);
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping Indeed jobs:', error);
      throw error;
    }
  }

  // Scrape Glassdoor jobs
  async scrapeGlassdoorJobs({ query, location, remote, rating }) {
    try {
      const page = await this.initBrowser();
      
      // Navigate to Glassdoor
      const searchUrl = this.buildGlassdoorSearchUrl({ query, location, remote, rating });
      await page.goto(searchUrl);
      
      // Wait for job listings to load
      await page.waitForSelector('.react-job-listing', { timeout: 10000 });
      
      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('.react-job-listing');
        return Array.from(jobCards, (card, index) => {
          const titleElement = card.querySelector('.job-title');
          const companyElement = card.querySelector('.employer-name');
          const locationElement = card.querySelector('.location');
          const linkElement = card.querySelector('a');
          
          return {
            id: `glassdoor_${index}`,
            title: titleElement?.textContent?.trim() || '',
            company: companyElement?.textContent?.trim() || '',
            location: locationElement?.textContent?.trim() || '',
            url: linkElement?.href || '',
            platform: 'glassdoor',
            timestamp: new Date().toISOString()
          };
        }).slice(0, 20);
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping Glassdoor jobs:', error);
      throw error;
    }
  }

  // Build search URLs for different platforms
  buildLinkedInSearchUrl({ query, location, remote, experience }) {
    const params = new URLSearchParams();
    if (query) params.append('keywords', query);
    if (location) params.append('location', location);
    if (remote) params.append('f_WT', '2');
    if (experience) params.append('f_E', experience);
    
    return `https://www.linkedin.com/jobs/search/?${params.toString()}`;
  }

  buildAngelListSearchUrl({ query, location, remote, funding }) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (remote) params.append('remote', 'true');
    if (funding) params.append('funding', funding);
    
    return `https://angel.co/jobs?${params.toString()}`;
  }

  buildIndeedSearchUrl({ query, location, remote, salary }) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('l', location);
    if (remote) params.append('remotejob', '1');
    if (salary) params.append('salary', salary);
    
    return `https://www.indeed.com/jobs?${params.toString()}`;
  }

  buildGlassdoorSearchUrl({ query, location, remote, rating }) {
    const params = new URLSearchParams();
    if (query) params.append('sc.keyword', query);
    if (location) params.append('locT', location);
    if (remote) params.append('remoteWorkType', '1');
    if (rating) params.append('minRating', rating);
    
    return `https://www.glassdoor.com/Job/jobs.htm?${params.toString()}`;
  }

  // Filter and rank jobs based on criteria
  filterAndRankJobs(jobs, criteria) {
    return jobs
      .filter(job => {
        if (criteria.remote && !job.location.toLowerCase().includes('remote')) {
          return false;
        }
        if (criteria.industry && !job.title.toLowerCase().includes(criteria.industry.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Simple ranking based on relevance
        let scoreA = 0, scoreB = 0;
        
        if (criteria.query) {
          const queryLower = criteria.query.toLowerCase();
          if (a.title.toLowerCase().includes(queryLower)) scoreA += 2;
          if (b.title.toLowerCase().includes(queryLower)) scoreB += 2;
          if (a.company.toLowerCase().includes(queryLower)) scoreA += 1;
          if (b.company.toLowerCase().includes(queryLower)) scoreB += 1;
        }
        
        return scoreB - scoreA;
      });
  }

  // Get job by ID
  async getJobById(id) {
    // This would typically query a database
    // For now, return a mock job
    return {
      id,
      title: 'Sample Job',
      company: 'Sample Company',
      location: 'Remote',
      description: 'Sample job description...',
      url: 'https://example.com/job',
      platform: 'linkedin',
      timestamp: new Date().toISOString()
    };
  }

  // Apply to a job
  async applyToJob({ jobId, resumeId, coverLetter, customMessage }) {
    try {
      const job = await this.getJobById(jobId);
      const page = await this.initBrowser();
      
      // Navigate to job application page
      await page.goto(job.url);
      
      // Fill application form
      await this.fillApplicationForm(page, {
        resumeId,
        coverLetter,
        customMessage
      });
      
      // Submit application
      await page.click('[data-testid="submit-application"]');
      
      // Wait for confirmation
      await page.waitForSelector('.application-success', { timeout: 10000 });
      
      return {
        success: true,
        jobId,
        message: 'Application submitted successfully'
      };
    } catch (error) {
      console.error('Error applying to job:', error);
      return {
        success: false,
        jobId,
        error: error.message
      };
    }
  }

  // Bulk apply to multiple jobs
  async bulkApplyToJobs({ jobIds, resumeId, coverLetter, customMessage }) {
    const results = [];
    
    for (const jobId of jobIds) {
      try {
        const result = await this.applyToJob({
          jobId,
          resumeId,
          coverLetter,
          customMessage
        });
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          jobId,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Fill application form
  async fillApplicationForm(page, { resumeId, coverLetter, customMessage }) {
    // This is a simplified version - in reality, you'd need to handle
    // different application forms for different platforms
    
    // Fill name
    await page.fill('[data-testid="name-input"]', 'Your Name');
    
    // Fill email
    await page.fill('[data-testid="email-input"]', 'your.email@example.com');
    
    // Fill phone
    await page.fill('[data-testid="phone-input"]', '+1234567890');
    
    // Upload resume if provided
    if (resumeId) {
      const fileInput = await page.$('[data-testid="resume-upload"]');
      if (fileInput) {
        await fileInput.setInputFiles(`./uploads/${resumeId}`);
      }
    }
    
    // Fill cover letter if provided
    if (coverLetter) {
      await page.fill('[data-testid="cover-letter-input"]', coverLetter);
    }
    
    // Fill custom message if provided
    if (customMessage) {
      await page.fill('[data-testid="custom-message-input"]', customMessage);
    }
  }

  // Get job application history
  async getJobHistory(userId) {
    // This would typically query a database
    return [
      {
        id: '1',
        jobId: 'linkedin_1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        status: 'applied',
        appliedAt: new Date().toISOString()
      }
    ];
  }

  // Delete a job from history
  async deleteJob(id) {
    // This would typically delete from a database
    console.log(`Deleting job ${id} from history`);
    return true;
  }
}

module.exports = new JobsService(); 