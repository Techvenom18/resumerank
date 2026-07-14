import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Your Jobs</h1>
          <Link
            href="/jobs/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="mb-4 text-gray-600">
              You haven&apos;t created any job postings yet.
            </p>
            <Link
              href="/jobs/new"
              className="inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
                  className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm"
                >
                  <h2 className="font-medium text-gray-900">{job.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
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