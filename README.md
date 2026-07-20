# ResumeRank

> Screens and ranks job applicants against a job description, with a transparent score breakdown — built for recruiters who are tired of manually skimming hundreds of resumes.

**Live demo →** https://resumerank-two.vercel.app

**Demo login:** `demo@demo.com` / `demo1234`
*(or sign up with your own account — it's a 30-second process)*

---

## Features

- Create a job posting with required/preferred skills and a minimum experience threshold
- Bulk-upload candidates via CSV (name + resume text)
- Automatically scores every candidate 0–100 against the job using a weighted formula (skills, experience, education)
- See a full explainability breakdown per candidate: matched skills, missing skills, experience match, education match — not just a number
- Shortlist or reject candidates, with status persisted per candidate
- Full auth — every recruiter only sees their own jobs and candidates

## Tech Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS · PostgreSQL (Neon) · Prisma ORM · Auth.js (NextAuth) · Zod · Deployed on Vercel

## Quick Start

```bash
git clone https://github.com/Techvenom18/resumerank
cd resumerank
cp .env.example .env
# fill in DATABASE_URL and AUTH_SECRET in .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
# visit http://localhost:3000
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (e.g. from [Neon](https://neon.com) or [Supabase](https://supabase.com)) |
| `AUTH_SECRET` | Secret used to sign session tokens. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

## How scoring works

Each candidate is scored 0–100 using a weighted formula:

- **50% — Skills match**: keyword-matches the candidate's resume text against the job's required and preferred skills
- **30% — Experience match**: extracts years of experience mentioned in the resume text, compared against the job's minimum requirement
- **20% — Education match**: detects education level (Bachelors/Masters) mentioned in the resume text

This is a lexicon/keyword-based approach rather than an LLM call — chosen deliberately for v1 to keep scoring fast, free, and fully explainable (a recruiter can see exactly why a score was given). A natural next step would be an LLM-based resume parse for messier, less structured resumes — see "What I'd build next" in the case study.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the data model and key design decisions.

## Testing

Manually tested end-to-end: signup → login → job creation → CSV upload → scoring → candidate detail → status update, both locally and on the deployed production URL.

## Roadmap

- [x] Auth, job CRUD, CSV upload, scoring engine, candidate detail with rationale, status management
- [ ] Search/filter/sort on the candidate list
- [ ] CSV export of ranked shortlist
- [ ] PDF resume upload (currently CSV-only)
- [ ] LLM-based resume parsing for unstructured resumes

## Demo Video

![ResumeRank demo](docs/screenshots/resumerank_demo_hq.gif)

## License

MIT — see [LICENSE](LICENSE)

---

*Developed and Design by Sumit Kumar as a trial task for the Digital Heroes Full Stack Developer Program.*