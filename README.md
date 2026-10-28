# CareerPilot AI — Smart Resume Screening, Enhancement & Job Recommendation System

**CareerPilot AI** is a production-grade full-stack web application designed for students, fresh graduates, and experienced professionals to screen resumes, optimize ATS compatibility, improve bullet points with user-controlled AI assistance, match against job postings, and track applications across career pipelines.

---

## 🌟 Key Features

### 1. Premium UI/UX Design System
- **Deep Midnight Aesthetic**: `#080C14` backdrop with electric indigo and violet gradients, glowing callouts, and clean borders.
- **Hero Showcase**: Angled 3D resume sheet with glowing AI enhancement badges (*"Try: 'Improved website UI, increasing conversion by 24%'"*, *"88% ATS Job Compatibility Match"*).
- **Responsive Layout**: Designed for mobile (360px+), tablet, laptop, and ultra-wide desktop viewports.

### 2. Multi-Stage Resume Upload & Document Parsing
- Real document extraction supporting both **PDF** (`pdf-parse`) and **DOCX** (`mammoth`) formats.
- Animated multi-stage processing pipeline:
  1. *Uploading document securely*
  2. *Extracting text content*
  3. *Identifying resume sections (Experience, Education, Skills, Projects, Certifications)*
  4. *Analyzing skills and work experience*
  5. *Evaluating ATS compatibility benchmarks*
  6. *Generating actionable recommendations*

### 3. AI Resume Screening Engine
- **8-Category Deterministic Evaluation (0-100)**:
  1. **Content Quality** (quantifiable metrics, active power verbs, impact metrics)
  2. **Skills Relevance** (technical and soft skill breadth)
  3. **Experience Relevance** (role progression and chronological clarity)
  4. **Project Quality** (problem-action-result, architectural tools)
  5. **Readability** (brevity, bullet rhythm, scannability)
  6. **Formatting Consistency** (uniform dates, header standards)
  7. **Section Completeness** (all essential career components present)
  8. **ATS Compatibility** (machine-parseable headers, keyword density)
- **Detailed Weakness Cards**: Every opportunity includes:
  - *What is wrong*
  - *Why it matters*
  - *How to fix it*
  - *A real before-and-after concrete example*
- **Keyword Extraction & Cloud**: Visual breakdown of verified resume skills vs missing high-demand industry technologies.

### 4. User-Controlled Resume Alteration (Explicit Permission Workflow)
- **Suggestion Mode vs Edit Mode**: Review recommendations without altering your document, or switch to Edit Mode to approve modifications.
- **Side-by-Side Comparisons**: Original text vs AI enhanced version with rationale and impact tags.
- **Granular Actions**: Accept, Reject, Edit manually, or Regenerate.
- **Immutable Version Creation**: Applying approved suggestions creates a new version (e.g., Version 2, Version 3) with an audit trail, keeping your original uploaded document 100% intact.
- **Version History Drawer**: Compare versions and restore any previous version in one click.

### 5. Interactive Resume Builder
- **3-Panel SaaS Workspace**:
  - *Left Panel*: Section navigation and inline editors for Contact, Summary, Experience, Education, Projects, Skills, and Certifications.
  - *Center Panel*: Live formatted resume sheet with zoom controls (75% - 125%), template switcher, and instant **PDF Export** (`window.print` / clean print canvas).
  - *Right Panel*: Live quality feedback and autosave status indicator.
- **Export Options**: High-resolution printable PDF and structured JSON data export.

### 6. Role-Specific Template Gallery (12 Templates)
- 12 professionally crafted layouts across 15 career tracks:
  - *ATS Classic Clean* (Software Developer)
  - *Modern Executive Violet* (Full-Stack Engineer)
  - *Minimal Monospace Dev* (Frontend Developer)
  - *Data Science Metricist* (Data Science & Analytics)
  - *Cloud DevOps Sovereign* (Cloud & SRE)
  - *Creative Product Designer* (UI/UX)
  - *Corporate Executive Prime* (Experienced Leaders)
  - *Campus Graduate First* (Freshers & Interns)
  - *Cybersecurity Sentinel* (Security Analysts)
  - *Academic Scholar & Fellow* (Researchers & Postdocs)
  - *Two-Column Precision* (Full-Stack Product Teams)
  - *Elegant Monochrome Minimalist* (Career Switchers)
- Live preview modal and instant loading into the builder.

### 7. Job Role Recommendation Engine
- Recommends target engineering roles based directly on your resume's technical stack and verified projects.
- Displays match percentages, matching skills, skill gaps, learning strategies, and recommended certifications.

### 8. Job Discovery Board & Description Matcher
- **Job Discovery**: Search verified and seed tech postings with filters for Remote/Hybrid/Onsite, Experience level, and Salary ranges.
- **Job Description Matcher**: Paste any target job description or choose a saved listing to generate:
  - Overall match score (0-100) and skills coverage %
  - **Requirement vs Resume Evidence Matrix** (Status: Matched, Partial, Missing)
  - Tailored technical interview questions

### 9. Skill Gap Analysis & 90-Day Learning Roadmap
- **Interactive Skill Matrix**: Track competencies with status toggles (`Not Started` → `Learning` → `Practicing` → `Completed`).
- **30 / 60 / 90 Day Timeline**: Concrete milestone breakdown and hands-on capstone project specifications for your target role.

### 10. Application Tracker & Career Analytics
- **Dual-View Tracker**: Kanban Board & Data Table views across stages: *Saved*, *Applied*, *Assessment*, *Interview*, *Offer*, and *Rejected*.
- **Career Analytics**: Interactive Recharts graphs showing resume quality progression over time and application pipeline conversion.

### 11. Profile & Privacy Settings
- Personal information & target career preferences.
- Privacy controls: AI processing consent toggle and resume retention policy (30 - 365 days).
- **Download All My Data**: Full GDPR-compliant JSON export.
- Safe resume deletion and complete account purging.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, Canvas-Confetti |
| **Backend** | Node.js, Express.js, TypeScript, REST API, JWT with HTTP-only cookies, bcryptjs, Multer |
| **Document Parsing**| `pdf-parse` (PDF text extraction), `mammoth` (DOCX extraction) |
| **Database** | MongoDB, Mongoose schemas with indexed ownership |
| **AI Layer** | Configurable LLM Provider (Gemini / OpenAI) + Local Deterministic Fallback Engine |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended, tested on v22)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/careerpilot_ai`)

### 1. Clone & Configure Environment
```bash
git clone <repository_url>
cd "theena resume"
cp .env.example server/.env
```

### 2. Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Seed Database
Seeds 8 realistic verified tech postings and a default demo account (`demo@careerpilot.ai` / `Password123!`):
```bash
cd server
npm run seed
```

### 4. Start Development Servers
Open two terminal windows:

**Terminal 1 (Backend API on http://localhost:5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on http://localhost:5173):**
```bash
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## ⚡ Quick Test Drive (Demo Mode)
For rapid verification without registration:
1. Click **"⚡ Instant Demo"** on the landing page or navbar.
2. The application will log you in immediately as `demo@careerpilot.ai` with pre-loaded resumes, recommendations, and analytics.

---

## 🔒 Security & Data Privacy
- **Encrypted Password Hashing**: Passwords stored as salted bcrypt hashes.
- **Token Rotation**: Short-lived JWT access tokens paired with secure HTTP-only refresh cookies.
- **Isolated Storage**: Uploaded files are assigned random hex keys in a non-executable directory and ownership is strictly validated before access.
- **Zero Hallucination Fallback**: The deterministic local engine guarantees complete functionality even without an external AI API key.

---

## 📜 License
MIT License. Built by the CareerPilot AI Engineering Team.
