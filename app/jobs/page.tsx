import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AuthGlow from "../AuthGlow";

export default async function JobsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="relative min-h-screen bg-white/80 px-6 py-10 backdrop-blur-[2px] dark:bg-gray-950/80">
      <AuthGlow />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Jobs</h1>
          <Link
            href="/jobs/new"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-400"
          >
            + New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 p-10 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/60">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You haven&apos;t created any job postings yet.
            </p>
            <Link
              href="/jobs/new"
              className="inline-block rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-400"
            >
              Create your first job
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="block rounded-lg border border-gray-200 bg-white/70 p-4 backdrop-blur-sm hover:border-gray-300 hover:bg-white/90 dark:border-gray-800 dark:bg-gray-900/70 dark:hover:border-gray-700 dark:hover:bg-gray-900/90"
                >
                  <h2 className="font-medium text-gray-900 dark:text-white">{job.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {job.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}