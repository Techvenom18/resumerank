import Link from "next/link";
import LandingLeaderboard from "./LandingLeaderboard";
import { ThemeToggle } from "./ThemeProvider";
import HeroGlow from "./HeroGlow";

export default function Home() {
  return (
    <main className="min-h-screen bg-white/80 backdrop-blur-[2px] dark:bg-gray-950/80">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span
          className="text-lg font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          ResumeRank
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-amber-500 dark:text-gray-900 dark:hover:bg-amber-400"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <HeroGlow />
        <div className="relative z-10">
          <h1
            className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-white"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Stop skimming resumes.
            <br />
            Start reviewing rankings.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Upload a batch of resumes against a job description. ResumeRank
            scores every candidate and shows you exactly why — matched
            skills, experience, and education — before you read a single
            resume in full.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-amber-500 dark:text-gray-900 dark:hover:bg-amber-400"
            >
              Try it free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex justify-center md:justify-end">
          <LandingLeaderboard />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 py-16 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                %
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Score with confidence
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Every candidate gets a 0–100 fit score based on skills,
                experience, and education — weighted the way you define the
                job.
              </p>
            </div>
            <div>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                ↑
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Bulk upload, instantly ranked
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Upload a CSV of resumes and get a fully ranked, sortable list
                back in seconds — no manual sorting through a spreadsheet.
              </p>
            </div>
            <div>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                ?
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                See why, not just what
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Every score comes with a breakdown: which skills matched,
                which didn&apos;t, and how experience and education factored
                in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2
          className="mb-10 text-2xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex gap-4">
            <span className="text-2xl font-bold text-amber-500">01</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Create a job posting
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add the title, description, required and preferred skills,
                and minimum experience.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl font-bold text-amber-500">02</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Upload your candidates
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Bulk-upload a CSV of resumes. Each one is scored against your
                job automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl font-bold text-amber-500">03</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Review the ranking
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                See candidates sorted by fit, open any profile for the full
                rationale, and shortlist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-16 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2
            className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Your next hire is already in that pile of resumes.
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Find them in minutes, not days.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-amber-400"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>
            Built as a trial task for the Digital Heroes Full Stack Developer
            Program.
          </p>
          <p className="mt-1">© 2026 Sumit Kumar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}