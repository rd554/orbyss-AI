const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  // Generate tailored resume based on job description
  async tailorResume(resume, jobDescription, jobTitle, companyName) {
    try {
      const prompt = `
You are an expert resume writer. Tailor the following resume to match the job description.

Job Title: ${jobTitle}
Company: ${companyName}
Job Description: ${jobDescription}

Original Resume:
${resume}

Please create a tailored version that:
1. Highlights relevant skills and experiences
2. Uses keywords from the job description
3. Emphasizes achievements that match the role
4. Maintains professional formatting
5. Keeps the same structure but optimizes content

Return only the tailored resume text:
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer who creates tailored resumes for specific job opportunities.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw new Error('Failed to tailor resume');
    }
  }

  // Generate cover letter based on job and resume
  async generateCoverLetter(jobDescription, jobTitle, companyName, resume, customMessage = '') {
    try {
      const prompt = `
You are an expert cover letter writer. Create a compelling cover letter for the following job.

Job Title: ${jobTitle}
Company: ${companyName}
Job Description: ${jobDescription}

Applicant's Resume:
${resume}

Custom Message (if provided):
${customMessage}

Please create a cover letter that:
1. Addresses the hiring manager professionally
2. Explains why you're interested in the role
3. Highlights relevant experience from your resume
4. Shows enthusiasm for the company
5. Includes a call to action
6. Is concise but compelling (max 300 words)

Return only the cover letter text:
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert cover letter writer who creates compelling, personalized cover letters.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  // Generate personalized DM for recruiters
  async generateRecruiterDM(recruiterName, recruiterCompany, jobTitle, resume, customMessage = '') {
    try {
      const prompt = `
You are an expert at writing professional LinkedIn DMs to recruiters. Create a personalized message.

Recruiter Name: ${recruiterName}
Company: ${recruiterCompany}
Job Title: ${jobTitle}

Applicant's Resume:
${resume}

Custom Message (if provided):
${customMessage}

Please create a LinkedIn DM that:
1. Is professional but friendly
2. Mentions the recruiter by name
3. Shows interest in the specific role
4. Briefly highlights relevant experience
5. Asks for a conversation or application process
6. Is concise (max 150 words)
7. Includes a clear call to action

Return only the DM text:
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing professional, personalized LinkedIn messages to recruiters.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating recruiter DM:', error);
      throw new Error('Failed to generate recruiter DM');
    }
  }

  // Generate email for job applications
  async generateApplicationEmail(jobTitle, companyName, resume, coverLetter, customMessage = '') {
    try {
      const prompt = `
You are an expert at writing professional job application emails. Create an email for the following position.

Job Title: ${jobTitle}
Company: ${companyName}

Applicant's Resume:
${resume}

Cover Letter:
${coverLetter}

Custom Message (if provided):
${customMessage}

Please create a professional email that:
1. Has a clear subject line
2. Addresses the hiring manager professionally
3. Introduces the applicant
4. Mentions the specific position
5. References the attached resume and cover letter
6. Shows enthusiasm for the opportunity
7. Includes a professional closing
8. Is concise and well-structured

Return the email in this format:
Subject: [Subject Line]

[Email Body]
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing professional job application emails.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating application email:', error);
      throw new Error('Failed to generate application email');
    }
  }

  // Analyze job description for key requirements
  async analyzeJobDescription(jobDescription) {
    try {
      const prompt = `
Analyze the following job description and extract key information:

Job Description:
${jobDescription}

Please provide:
1. Required skills (technical and soft skills)
2. Preferred qualifications
3. Key responsibilities
4. Industry/domain
5. Experience level
6. Remote/hybrid/onsite preference
7. Salary range (if mentioned)
8. Company culture indicators

Return as JSON format:
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing job descriptions and extracting key requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const analysis = response.choices[0].message.content.trim();
      
      try {
        return JSON.parse(analysis);
      } catch (parseError) {
        // If JSON parsing fails, return as structured text
        return {
          analysis: analysis,
          raw: jobDescription
        };
      }
    } catch (error) {
      console.error('Error analyzing job description:', error);
      throw new Error('Failed to analyze job description');
    }
  }

  // Generate job search suggestions based on user profile
  async generateJobSuggestions(userProfile, preferences) {
    try {
      const prompt = `
Based on the following user profile and preferences, suggest job search strategies and keywords.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Preferences:
${JSON.stringify(preferences, null, 2)}

Please provide:
1. Recommended job titles to search for
2. Target companies/industries
3. Key search keywords
4. Suggested locations
5. Salary expectations
6. Application strategy tips

Return as JSON format:
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor who provides personalized job search recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const suggestions = response.choices[0].message.content.trim();
      
      try {
        return JSON.parse(suggestions);
      } catch (parseError) {
        return {
          suggestions: suggestions,
          profile: userProfile,
          preferences: preferences
        };
      }
    } catch (error) {
      console.error('Error generating job suggestions:', error);
      throw new Error('Failed to generate job suggestions');
    }
  }

  // Parse natural language commands into structured actions
  async parseCommand(command) {
    try {
      const prompt = `
Parse the following natural language command into structured actions for a job search automation system.

Command: "${command}"

Please return a JSON object with the following structure:
{
  "action": "search|apply|dm|scrape",
  "platforms": ["linkedin", "angellist", "indeed", "glassdoor"],
  "query": "job search terms",
  "location": "location if specified",
  "remote": true/false,
  "industry": "industry if specified",
  "experience": "experience level if specified",
  "count": number of results/actions,
  "customMessage": "any custom message provided"
}

Examples:
- "Find remote PM jobs in FinTech" → search action
- "Apply to 10 remote software jobs" → apply action
- "DM 5 recruiters at startups" → dm action
- "Scrape LinkedIn for marketing jobs" → scrape action
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at parsing natural language commands into structured job search actions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const parsed = response.choices[0].message.content.trim();
      
      try {
        return JSON.parse(parsed);
      } catch (parseError) {
        return {
          action: 'search',
          query: command,
          platforms: ['linkedin'],
          error: 'Failed to parse command'
        };
      }
    } catch (error) {
      console.error('Error parsing command:', error);
      throw new Error('Failed to parse command');
    }
  }
}

module.exports = new OpenAIService(); 