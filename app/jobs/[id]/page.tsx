import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AuthGlow from "../../AuthGlow";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job || job.userId !== session.user.id) {
    notFound();
  }

  const candidates = await prisma.candidate.findMany({
    where: { jobId: job.id },
    orderBy: { fitScore: "desc" },
  });

  return (
    <main className="relative min-h-screen bg-white/80 px-6 py-10 backdrop-blur-[2px] dark:bg-gray-950/80">
      <AuthGlow />

      <div className="relative z-10 mx-auto max-w-3xl">
        <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ← Back to jobs
        </Link>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{job.title}</h1>
          <p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
            {job.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-gray-900"
              >
                {skill}
              </span>
            ))}
            {job.preferredSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidates</h2>
          <Link
            href={`/jobs/${job.id}/upload`}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-400"
          >
            Upload Candidates
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white/60 p-10 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/60">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              No candidates yet for this job.
            </p>
            <Link
              href={`/jobs/${job.id}/upload`}
              className="inline-block rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-400"
            >
              Upload your first batch
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {candidates.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/jobs/${job.id}/candidates/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/70 p-4 backdrop-blur-sm hover:border-gray-300 hover:bg-white/90 dark:border-gray-800 dark:bg-gray-900/70 dark:hover:border-gray-700 dark:hover:bg-gray-900/90"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.status === "SHORTLISTED"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : c.status === "REJECTED"
                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {c.fitScore != null ? `${c.fitScore.toFixed(0)}% fit` : "Not scored"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}