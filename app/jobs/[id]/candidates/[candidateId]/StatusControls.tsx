"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "NEW" | "SHORTLISTED" | "REJECTED";

export default function StatusControls({
  candidateId,
  initialStatus,
}: {
  candidateId: string;
  initialStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: Status) {
    setLoading(true);
    const res = await fetch(`/api/candidates/${candidateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
      <button
        disabled={loading || status === "SHORTLISTED"}
        onClick={() => updateStatus("SHORTLISTED")}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-40"
      >
        Shortlist
      </button>
      <button
        disabled={loading || status === "REJECTED"}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-40"
      >
        Reject
      </button>
      {status !== "NEW" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("NEW")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      )}
      <span
        className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
          status === "SHORTLISTED"
            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
            : status === "REJECTED"
            ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        Currently: {status}
      </span>
    </div>
  );
}