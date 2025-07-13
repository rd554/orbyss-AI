# 💫 Orbyss AI

**AI-Powered Browser-Based Job Agent (Comet-Inspired)**

Orbyss AI is a futuristic, prompt-first web agent that automates end-to-end job discovery, resume tailoring, auto-application, and recruiter/PM DMs across platforms like LinkedIn, AngelList, etc. Inspired by Comet, it will eventually become a multi-domain action agent, starting with job search as the initial domain.

## 🌟 Features

### Core Features (v1)

1. **Prompt-First Interface**: Chat-style input for commands like:
   - "Find remote PM jobs in FinTech and apply"
   - "DM 10 recruiters at FinTech startups with a tailored message"

2. **Job Board Scraping**:
   - Scrape LinkedIn Jobs, AngelList, Indeed, Glassdoor (Playwright-based)
   - Normalize job output (title, company, JD, apply link)

3. **LinkedIn Post Parsing**:
   - Extract posts mentioning hiring, filter by domain
   - Analyze post text to determine action:
     - If email found → auto-email resume with custom message
     - If DM requested → auto-send tailored DM
     - If external link → auto-navigate and apply via Playwright

4. **Resume/Cover Letter Tailoring**:
   - Upload resume once
   - Auto-tailor it per job description using OpenAI
   - Generate role-specific cover letter dynamically before applying

5. **Auto-Apply Logic**:
   - Auto-fill LinkedIn Easy Apply, AngelList, Greenhouse, Lever, etc.
   - Adjust resume and cover letter in real-time based on company context

6. **Recruiter/PM DM Automation**:
   - Auto-generate personalized DMs based on recruiter name, gender, company domain
   - Playwright-based auto-DM via LinkedIn

7. **Live Agent Thread + Result Cards**:
   - Realtime agent feedback
   - Interactive job cards with status indicators

8. **Thread History**:
   - Saved sessions (prompt, responses, job data, DM logs)

9. **Behavioral Learning**:
   - Learns user preferences over time
   - Adapts tone and structure of resume, cover letters, DMs
   - Suggests actions based on past commands

10. **Real-Time Auto-Apply Engine**:
    - Agent continuously scrapes job boards + LinkedIn posts
    - Automatically parses JD/post content, tailors resume/message, applies or sends DMs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- LinkedIn credentials (for DM automation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orbyss-ai
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp backend/env.example backend/.env
   
   # Edit .env with your API keys
   OPENAI_API_KEY=your_openai_api_key_here
   LINKEDIN_EMAIL=your_linkedin_email
   LINKEDIN_PASSWORD=your_linkedin_password
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
orbyss-ai/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   └── ui/         # shadcn/ui components
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                  # Express.js backend
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── services/            # Business logic
│   ├── prompts/             # AI prompts
│   ├── schedulers/          # Background jobs
│   ├── storage/             # Data storage
│   └── app.js              # Main server file
└── README.md
```

## 🎨 UI/UX Design

### Layout
```
+------------------------------------------------+
| 💫 Orbyss AI          [🕒 History] [⚙️ Settings] |
+------------------------------------------------+

| > Prompt Input Bar (centered, elegant)        |
|   e.g. "Find PM jobs in FinTech and DM recruiters" |
+------------------------------------------------+

| 🧠 Agent Output Thread (center panel)   |
| • Searching LinkedIn...                        |
| • Found 12 matches                            |
| • Applied to 7 | DMed 3 recruiters             |
+------------------------------------------------+

| 📄 Job Cards / Post Cards (bottom list)    |
| • View JD | Resume Preview | DM Preview        |
| • Status: Applied ✅, Skipped ❌, DM Sent 💬     |
+------------------------------------------------+
```

### Design Features
- Elegant, futuristic gradients and micro-animations
- Hover-based interactivity
- Mobile-friendly responsive layout
- Smooth transitions when loading agent steps

## 🔧 API Endpoints

### Jobs
- `GET /api/jobs/search` - Search for jobs
- `GET /api/jobs/scrape` - Scrape jobs from platforms
- `POST /api/jobs/apply` - Apply to a job
- `POST /api/jobs/bulk-apply` - Bulk apply to jobs

### Posts
- `GET /api/posts/linkedin` - Parse LinkedIn posts
- `GET /api/posts/hiring` - Find hiring posts
- `POST /api/posts/action` - Take action on post

### Resume
- `POST /api/resume/upload` - Upload resume
- `POST /api/resume/tailor` - Tailor resume for job

### DM
- `POST /api/dm/send` - Send DM to recruiter
- `POST /api/dm/bulk` - Send bulk DMs

### Memory
- `GET /api/memory/profile` - Get user profile
- `GET /api/memory/recommendations` - Get recommendations
- `POST /api/memory/learn` - Learn from action

## 🤖 AI Features

### OpenAI Integration
- **Resume Tailoring**: Customize resume for specific job descriptions
- **Cover Letter Generation**: Create compelling, personalized cover letters
- **DM Creation**: Generate professional LinkedIn messages
- **Command Parsing**: Convert natural language to structured actions
- **Job Analysis**: Extract key requirements from job descriptions

### Behavioral Learning
- **User Preferences**: Track preferred industries, job titles, locations
- **Application Patterns**: Learn from successful applications
- **Response Analysis**: Analyze recruiter response patterns
- **Recommendations**: Provide personalized job search suggestions

## 🔒 Security & Privacy

- Environment-based configuration
- Secure credential storage
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Fly.io/Render)
```bash
cd backend
npm run build
# Deploy to Fly.io or Render
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📈 Roadmap

### v1.1 - Enhanced Automation
- [ ] Advanced LinkedIn post parsing
- [ ] Multi-platform job application
- [ ] Email automation
- [ ] Interview scheduling

### v1.2 - AI Improvements
- [ ] Advanced resume analysis
- [ ] Interview preparation AI
- [ ] Salary negotiation assistance
- [ ] Career path recommendations

### v2.0 - Multi-Domain Agent
- [ ] Expand beyond job search
- [ ] Task automation
- [ ] Calendar management
- [ ] Email automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by Comet's prompt-first interface
- Built with Next.js, Express, OpenAI, and Playwright
- UI components from shadcn/ui
- Styling with Tailwind CSS

---

**💫 Orbyss AI - Your AI-Powered Job Search Companion** 