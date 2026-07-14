import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to jobs
        </Link>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          <p className="mt-2 whitespace-pre-wrap text-gray-600">
            {job.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white"
              >
                {skill}
              </span>
            ))}
            {job.preferredSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
          <Link
            href={`/jobs/${job.id}/upload`}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Upload Candidates
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="mb-4 text-gray-600">
              No candidates yet for this job.
            </p>
            <Link
              href={`/jobs/${job.id}/upload`}
              className="inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {c.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
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