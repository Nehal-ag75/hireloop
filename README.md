🎯 Hireloop — AI-Powered Interview Preparation Platform
✨ Features

🤖 AI Mock Interview


Select your target company (50+ options: Google, Amazon, Meta, DE Shaw, Jane Street, etc.)
Choose difficulty (Easy / Medium / Hard) and technical domain (DSA, OS, DBMS, CN, OOP, System Design)
AI interviewer asks one question at a time, probes deeper based on your answers
Scorecard generated at the end with ratings across Problem Solving, Communication, Complexity Awareness, and Edge Case Handling
Powered by Groq API (LLaMA 3.3 70B) — fast and free


📚 Problem Bank


511 real problems from LeetCode and GeeksForGeeks
Covers 12 major topics: Arrays, Strings, Linked List, Trees, Graphs, Dynamic Programming, Backtracking, Stack & Queue, Heap, Binary Search, Greedy, Bit Manipulation
Filter by topic and difficulty
Mark problems as Solved or Failed
Due Today tab for spaced repetition reviews
Direct links to LeetCode/GFG problem pages


🧠 Spaced Repetition (SM-2 Algorithm)


Failed problems are automatically scheduled for review using the SM-2 spaced repetition algorithm
Problems due for review appear in the Due Today section
Tracks your review history and adjusts intervals based on performance


🗺️ Personalized Roadmap


Generates a day-by-day study plan based on your target company and available days
Balanced daily allocation: 2 Easy + 2 Medium + 2 Hard problems per day
Round-robin topic coverage ensures breadth across all DSA areas


📄 Resume Analyzer


Upload your resume (PDF)
Select from 28 target roles (SDE Intern, Backend Engineer, ML Engineer, etc.)
AI provides:

Match Score (0-100)
Strengths identified in your resume
Missing Keywords for your target role
Rewritten bullet points — stronger, impact-focused versions
Overall Feedback with actionable suggestions





🏢 Company-Wise Problems


Filter problems by 50+ top companies including FAANG, FinTech, Unicorns
Each company shows a balanced set of 60 problems (20 Easy + 25 Medium + 15 Hard)
Companies with tagged problems show those first; others get a curated balanced set


📊 Dashboard


Problems solved count
Current streak (days in a row)
Topics covered
Days remaining until target date
Quick actions to Practice, View Roadmap, or Start Mock Interview



🛠 Tech Stack

Frontend

TechnologyPurposeReact 18 + ViteUI framework and build toolTailwind CSSUtility-first stylingReact Router v6Client-side routingAxiosHTTP clientLucide ReactIcon library

Backend

TechnologyPurposeNode.js + ExpressREST API serverPostgreSQLRelational databaseJWTAuthenticationMulter + pdf-parseResume PDF processingGroq SDK (LLaMA 3.3 70B)AI featuresdotenvxEnvironment variable management

Database Schema

users          — Authentication, profile, target company
problems       — 511 problems with topics, difficulty, companies, links
attempts       — User problem attempts with SM-2 spaced repetition
roadmap        — Generated day-by-day study plans
interview_sessions — Mock interview conversations and scorecards


🚀 Local Setup

Prerequisites


Node.js v18+
PostgreSQL 14+
Git


1. Clone the repository

bashgit clone https://github.com/Nehal-ag75/hireloop.git
cd hireloop

2. Setup the Backend

bashcd server
npm install

Create a .env file in the server/ directory:

envPORT=5000
JWT_SECRET=your_random_jwt_secret
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hireloop
GROQ_API_KEY=your_groq_api_key

Get your free Groq API key at: https://console.groq.com

3. Setup the Database

bash# Create the database
psql -U postgres -c "CREATE DATABASE hireloop;"

# Run migrations (create tables)
psql -U postgres -d hireloop -f db/schema.sql

# Seed 511 real problems
psql -U postgres -d hireloop -f seed_problems.sql

4. Setup the Frontend

bashcd ../client
npm install

Create a .env file in the client/ directory:

envVITE_API_URL=http://localhost:5000

5. Run the Application

bash# Terminal 1 — Start backend
cd server
node server.js

# Terminal 2 — Start frontend
cd client
npm run dev

Open http://localhost:5173 in your browser.


🌐 Deployment

Backend — Render


Connect GitHub repo to Render
Root Directory: server
Build Command: npm install
Start Command: node server.js
Add all environment variables from .env


Frontend — Vercel


Connect GitHub repo to Vercel
Root Directory: client
Build Command: npm run build
Output Directory: dist
Add environment variable: VITE_API_URL=https://your-render-backend-url.onrender.com


Database — Render PostgreSQL


Create a new PostgreSQL instance on Render
Copy the External Database URL
Set it as DATABASE_URL in your backend environment variables
Run the seed script to populate problems



📡 API Reference

Authentication

MethodEndpointDescriptionPOST/api/auth/registerRegister a new userPOST/api/auth/loginLogin and get JWT token

Problems

MethodEndpointDescriptionGET/api/roadmap/problemsGet all problemsPOST/api/attempts/submitSubmit a problem attemptGET/api/attempts/historyGet attempt historyGET/api/attempts/due-todayGet problems due for review

Mock Interview

MethodEndpointDescriptionPOST/api/interview/startStart a new interview sessionPOST/api/interview/:id/respondSend a response to the interviewerPOST/api/interview/:id/endEnd session and get scorecard

Roadmap

MethodEndpointDescriptionPOST/api/roadmap/generateGenerate a personalized roadmapGET/api/roadmap/my-roadmapGet current user's roadmap

Resume

MethodEndpointDescriptionPOST/api/resume/analyzeAnalyze a PDF resume

Companies

MethodEndpointDescriptionGET/api/companies/listGet list of all companiesGET/api/companies/filterFilter problems by company and difficulty

AI

MethodEndpointDescriptionPOST/api/ai/reviewGet AI code reviewPOST/api/ai/hintGet Socratic hint


📁 Project Structure

hireloop/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   └── Layout.jsx      # Sidebar + navigation
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Problems.jsx
│   │       ├── MockInterview.jsx
│   │       ├── ResumeAnalyzer.jsx
│   │       ├── Roadmap.jsx
│   │       ├── Companies.jsx
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   └── package.json
│
└── server/                     # Node.js backend
    ├── helpers/
    │   ├── aiService.js        # Groq AI integration
    │   └── resumeParser.js     # PDF text extraction
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification
    ├── routes/
    │   ├── auth.js
    │   ├── problems.js
    │   ├── attempts.js
    │   ├── roadmap.js
    │   ├── interview.js
    │   ├── resume.js
    │   ├── companies.js
    │   └── ai.js
    ├── db.js                   # PostgreSQL connection pool
    ├── seed_problems.sql       # 511 real problems seed data
    └── server.js               # Express app entry point


🔑 Environment Variables

Server (server/.env)

VariableDescriptionPORTServer port (default: 5000)JWT_SECRETSecret key for JWT signingDATABASE_URLPostgreSQL connection stringGROQ_API_KEYGroq API key (get free at console.groq.com)

Client (client/.env)

VariableDescriptionVITE_API_URLBackend API URL
