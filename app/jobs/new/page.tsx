"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGlow from "../../AuthGlow";

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
    <main className="relative min-h-screen px-6 py-10">
      <AuthGlow />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-white">
          Create a new job posting
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-gray-800 bg-gray-900/70 p-6 backdrop-blur-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Job title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Job description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste or write the job description..."
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Required skills{" "}
              <span className="font-normal text-gray-500">
                (comma-separated)
              </span>
            </label>
            <input
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, MySQL"
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Preferred skills{" "}
              <span className="font-normal text-gray-500">
                (comma-separated, optional)
              </span>
            </label>
            <input
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="e.g. Docker, Kubernetes"
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Minimum years of experience{" "}
              <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              type="number"
              min={0}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              placeholder="e.g. 2"
              className="w-32 rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create job"}
          </button>
        </form>
      </div>
    </main>
  );
}