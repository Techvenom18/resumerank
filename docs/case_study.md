# Case Study: ResumeRank

## Problem

Recruiters routinely receive 100+ applications for a single job posting, but only have time to seriously read a fraction of them. The result is a lot of manual, repetitive skimming and a real risk that a strong candidate gets missed simply because their resume was the 80th one opened, not the 3rd.

Most existing tools either solve this shallowly (basic keyword search) or require a full-blown ATS (Applicant Tracking System) that's overkill for a small team or an individual recruiter who just wants a fast, trustworthy first pass.

## Approach

I scoped ResumeRank as a focused resume-screening tool, the single highest-leverage slice of a full ATS rather than trying to build a broad, shallow version of everything a hiring pipeline needs. The trade-off I optimized for throughout was **depth over breadth**: one thing (screening and ranking) done well, rather than five things done half well.

**Data model**: Three core entities — `User`, `Job`, `Candidate` kept intentionally simple. Each job has required/preferred skills and a minimum experience threshold; each candidate has extracted skills, experience, education and a computed fit score with a stored breakdown (not just a number).

**Scoring engine**: I chose a transparent, keyword/lexicon-based scoring approach over an LLM-based one for v1. The formula is a weighted sum 50% skills match, 30% experience match, 20% education match computed directly from the resume text at upload time. This was a deliberate trade-off: an LLM-based parse would likely handle messier, less structured resumes better, but it would also be slower, cost money per resume and critically be far less explainable. A recruiter can look at ResumeRank's score breakdown and see exactly which skills matched and which didn't; that transparency was worth more to me than marginally better parsing accuracy on edge-case resumes.

**Auth and data isolation**: Every job and candidate is scoped to the recruiter who created it, enforced server-side on every query — not just hidden in the UI. This was non-negotiable from the start, since resume data is sensitive.

**Design**: I leaned into a distinctive visual identity (a warm amber accent, a cosmic dark-mode theme with an animated ranking motif in the hero) rather than a generic dashboard template, because the trial explicitly rewards intentional design decisions over default Bootstrap-style layouts.

## Result

A fully working, deployed product where a recruiter can:
- Sign up and create a job posting with required/preferred skills and a minimum experience bar
- Bulk-upload a CSV of candidate resumes
- See every candidate automatically scored 0–100 and ranked
- Open any candidate to see the full rationale behind their score — not just the number
- Shortlist or reject candidates, with status persisted

![ResumeRank demo](resumerank_demo_hq.gif)
*Ranked candidate list → opening a candidate → full score breakdown*

Live demo: https://resumerank-two.vercel.app
Repo: https://github.com/Techvenom18/resumerank

## What I learned

The most valuable lesson wasn't technical — it was scope discipline. Early on I was tempted to build PDF resume parsing, multi-recruiter team support, and an LLM-based scoring pipeline all in the first pass. Cutting those to "explicitly out of scope for v1" (documented in the README's roadmap) freed up time to actually finish the core loop end-to-end and polish it, instead of having five half-built features.

I also learned, very concretely, how much small infrastructure decisions compound — a wrong file placed in an API folder instead of a page folder, or a Prisma client not being generated on Vercel's build server, can silently break an entire deploy. Debugging those taught me to verify infrastructure (auth, database connection, build pipeline) before building features on top of it, not after.

If I were to continue building this, the next things I'd add are: PDF resume upload (currently CSV-only), an LLM-assisted parse as an option for messier resumes, and search/filter/sort on the candidate list — all explicitly documented as next steps rather than left unaddressed.
