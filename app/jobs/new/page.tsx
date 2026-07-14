"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills: requiredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          preferredSkills: preferredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          minExperienceYears: minExperience ? Number(minExperience) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/jobs/${data.job.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Create a new job posting
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-gray-200 bg-white p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Job title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Job description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste or write the job description..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Required skills{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </label>
            <input
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, MySQL"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Preferred skills{" "}
              <span className="font-normal text-gray-400">
                (comma-separated, optional)
              </span>
            </label>
            <input
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="e.g. Docker, Kubernetes"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Minimum years of experience{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              min={0}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              placeholder="e.g. 2"
              className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create job"}
          </button>
        </form>
      </div>
    </main>
  );
}