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
      <span className="text-sm text-gray-500">Status:</span>
      <button
        disabled={loading || status === "SHORTLISTED"}
        onClick={() => updateStatus("SHORTLISTED")}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40"
      >
        Shortlist
      </button>
      <button
        disabled={loading || status === "REJECTED"}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
      >
        Reject
      </button>
      {status !== "NEW" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("NEW")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Reset
        </button>
      )}
      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        Currently: {status}
      </span>
    </div>
  );
}