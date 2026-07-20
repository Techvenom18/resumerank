import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusControls from "./StatusControls";
import AuthGlow from "../../../../AuthGlow";

type ScoreBreakdown = {
  matched_skills: string[];
  missing_skills: string[];
  experience_match: string;
  education_match: string;
};

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string; candidateId: string }>;
}) {
  const { id: jobId, candidateId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { job: true },
  });

  if (!candidate || candidate.job.userId !== session.user.id || candidate.jobId !== jobId) {
    notFound();
  }

  const breakdown = candidate.scoreBreakdown as ScoreBreakdown | null;

  return (
    <main className="relative min-h-screen bg-white/80 px-6 py-10 backdrop-blur-[2px] dark:bg-gray-950/80">
      <AuthGlow />

      <div className="relative z-10 mx-auto max-w-2xl">
        <Link
          href={`/jobs/${jobId}`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to candidates
        </Link>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {candidate.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Applying for: {candidate.job.title}
              </p>
            </div>
            {candidate.fitScore != null && (
              <span className="rounded-full bg-amber-500 px-4 py-2 text-lg font-semibold text-gray-900">
                {candidate.fitScore}%
              </span>
            )}
          </div>

          <div className="mt-4">
            <StatusControls
              candidateId={candidate.id}
              initialStatus={candidate.status}
            />
          </div>
        </div>

        {breakdown && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Why this score?
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Matched skills:
                </span>{" "}
                {breakdown.matched_skills.length > 0 ? (
                  <span className="text-green-700 dark:text-green-400">
                    {breakdown.matched_skills.join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">None found</span>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Missing skills:
                </span>{" "}
                {breakdown.missing_skills.length > 0 ? (
                  <span className="text-red-600 dark:text-red-400">
                    {breakdown.missing_skills.join(", ")}
                  </span>
                ) : (
                  <span className="text-green-700 dark:text-green-400">None — all required skills matched</span>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{breakdown.experience_match}</span>
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Education:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{breakdown.education_match}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Resume text
          </h2>
          <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
            {candidate.rawResumeText}
          </p>
        </div>
      </div>
    </main>
  );
}