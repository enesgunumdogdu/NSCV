# NSCV — JobTailor AI

A local-first, free, AI-powered CV optimization tool. Tailor your resume to match specific job postings.

- Runs entirely on your machine — your data never leaves your device
- Free AI via Ollama (no API key required)
- SQLite database (zero configuration)

## Requirements

- **Node.js** 18+
- **Ollama** (for local AI)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/NSCV.git
cd NSCV

# 2. Install dependencies
npm install

# 3. Install Ollama (if not already installed)
brew install ollama

# 4. Download the AI model (~2GB, one-time)
ollama pull llama3.2

# 5. Start the Ollama server
ollama serve

# 6. In a new terminal, start the project
npm run dev
```

Open **http://localhost:3000** in your browser.

## Usage

### 1. Create a CV

**Sidebar > My CVs**

Two options:

- **+ New CV** — Create a blank CV and fill it in manually
- **Upload PDF** — Upload an existing PDF resume; AI will automatically populate the fields

A CV consists of 6 sections:
- Personal Info (name, email, phone, LinkedIn, GitHub)
- Summary
- Experience (with bullet points)
- Education
- Projects
- Skills (grouped by category)

Each section can be edited independently. Don't forget to save your changes.

### 2. Add a Job Posting

**Sidebar > Job Postings > + New Posting**

- Enter the position title and company/agency name
- **Select the application type:**
  - **Direct Company** — Standard company application
  - **Outsource / Agency** — Applications through firms like Randstad, Adecco, etc.
- Paste the full text of the job posting
- Save, then click **"Analyze with AI"**

The AI analysis will show:
- Required skills
- Preferred skills
- ATS keywords
- Hidden expectations (inferred between the lines)

### 3. Tailor Your CV

**Sidebar > Tailor & Analyze**

- Select your CV and the job posting
- Two options:
  - **Gap Analysis** — Shows gaps in your CV (match score, missing skills, weak bullets)
  - **Auto Tailor** — AI rewrites your entire CV to match the posting

For outsource postings, the AI focuses on industry and role keywords, making the CV easy to scan for non-technical recruiters.

### 4. Save a Version

If you're happy with the tailored CV, click **"Save as Version"**.
You can keep separate versions for each application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite (better-sqlite3) |
| AI | Ollama (llama3.2) |
| PDF Parse | pdf-parse |

## Configuration

Configurable via `.env.local`:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

To use a different model:

```bash
ollama pull mistral
# Set OLLAMA_MODEL=mistral in .env.local
```

## Project Structure

```
NSCV/
├── src/
│   ├── app/              # Pages and API routes
│   │   ├── cv/           # CV creation/editing page
│   │   ├── jobs/         # Job postings page
│   │   ├── tailor/       # Tailoring and analysis page
│   │   └── api/          # Backend APIs
│   ├── components/       # React components
│   │   ├── cv/           # CV editor components
│   │   ├── jobs/         # Job posting components
│   │   ├── tailor/       # Analysis/tailoring components
│   │   └── ui/           # Shared UI components
│   ├── lib/              # Core layer
│   │   ├── ai/           # AI client, prompts, schema validation
│   │   ├── types/        # TypeScript type definitions
│   │   └── db.ts         # SQLite connection
│   └── hooks/            # React hooks
├── scripts/              # Database schema
└── data/                 # SQLite DB file (gitignored)
```

## License

MIT
