"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UploadCandidatesPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    inserted: number;
    failedRows: { row: number; reason: string }[];
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please choose a CSV file first");
      return;
    }

    setLoading(true);

    try {
      const text = await file.text();

      const res = await fetch(`/api/jobs/${jobId}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);
    } catch {
      setError("Could not read or upload the file. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Upload candidates
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Upload a CSV with two columns: <code className="rounded bg-gray-200 px-1">name</code> and{" "}
          <code className="rounded bg-gray-200 px-1">resume_text</code>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
          />

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
            {loading ? "Processing..." : "Upload and score"}
          </button>
        </form>

        {result && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <p className="font-medium text-gray-900">
              {result.inserted} candidate(s) added and scored.
            </p>

            {result.failedRows.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-600">
                  {result.failedRows.length} row(s) failed:
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                  {result.failedRows.map((r) => (
                    <li key={r.row}>
                      Row {r.row}: {r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => router.push(`/jobs/${jobId}`)}
              className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View ranked candidates
            </button>
          </div>
        )}
      </div>
    </main>
  );
}