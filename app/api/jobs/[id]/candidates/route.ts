import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// --- Simple CSV parser that handles quoted fields with commas inside them ---
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
}

// --- Extract years of experience from free text, e.g. "5 years experience" ---
function extractExperienceYears(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*years?/i);
  if (match) return parseFloat(match[1]);
  return null;
}

// --- Extract education level from free text ---
function extractEducation(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("m.tech") || lower.includes("m.s.") || lower.includes("master"))
    return "Masters";
  if (
    lower.includes("b.tech") ||
    lower.includes("b.e.") ||
    lower.includes("b.sc") ||
    lower.includes("bachelor")
  )
    return "Bachelors";
  if (lower.includes("no formal degree") || lower.includes("fresher"))
    return "None stated";
  return null;
}

// --- Extract which of the job's skills appear in the resume text ---
function extractMatchedSkills(text: string, skills: string[]): string[] {
  const lower = text.toLowerCase();
  return skills.filter((skill) => lower.includes(skill.toLowerCase().trim()));
}

// --- Weighted scoring: 50% skills, 30% experience, 20% education ---
function computeScore({
  requiredSkills,
  preferredSkills,
  matchedRequired,
  matchedPreferred,
  candidateExperience,
  minExperience,
  education,
}: {
  requiredSkills: string[];
  preferredSkills: string[];
  matchedRequired: string[];
  matchedPreferred: string[];
  candidateExperience: number | null;
  minExperience: number | null;
  education: string | null;
}) {
  const requiredRatio =
    requiredSkills.length > 0 ? matchedRequired.length / requiredSkills.length : 1;
  const preferredRatio =
    preferredSkills.length > 0
      ? matchedPreferred.length / preferredSkills.length
      : 1;
  const skillsScore = requiredRatio * 40 + preferredRatio * 10;

  let experienceScore = 15;
  if (candidateExperience != null && minExperience != null) {
    experienceScore =
      candidateExperience >= minExperience
        ? 30
        : Math.max(0, (candidateExperience / minExperience) * 30);
  } else if (candidateExperience != null && minExperience == null) {
    experienceScore = 30;
  }

  let educationScore = 10;
  if (education === "Masters") educationScore = 20;
  else if (education === "Bachelors") educationScore = 15;
  else if (education === "None stated") educationScore = 8;

  const total = skillsScore + experienceScore + educationScore;

  return {
    total: Math.round(Math.min(100, Math.max(0, total))),
    breakdown: {
      matched_skills: [...matchedRequired, ...matchedPreferred],
      missing_skills: requiredSkills.filter((s) => !matchedRequired.includes(s)),
      experience_match:
        candidateExperience != null
          ? `${candidateExperience} years found (min required: ${minExperience ?? "not specified"})`
          : "Not found in resume text",
      education_match: education ?? "Not found in resume text",
    },
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job || job.userId !== session.user.id) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await request.json();
    const csvText = body.csvText as string | undefined;

    if (!csvText || csvText.trim().length === 0) {
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
    }

    const rows = parseCsv(csvText);

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSV must have a header row and at least one data row" },
        { status: 400 }
      );
    }

    const header = rows[0].map((h) => h.trim().toLowerCase());
    const nameIdx = header.indexOf("name");
    const textIdx = header.indexOf("resume_text");

    if (nameIdx === -1 || textIdx === -1) {
      return NextResponse.json(
        { error: "CSV must have 'name' and 'resume_text' columns" },
        { status: 400 }
      );
    }

    const failedRows: { row: number; reason: string }[] = [];
    let inserted = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = row[nameIdx]?.trim();
      const resumeText = row[textIdx]?.trim();

      if (!name) {
        failedRows.push({ row: i + 1, reason: "Missing candidate name" });
        continue;
      }
      if (!resumeText) {
        failedRows.push({ row: i + 1, reason: "Missing resume text" });
        continue;
      }

      const matchedRequired = extractMatchedSkills(resumeText, job.requiredSkills);
      const matchedPreferred = extractMatchedSkills(resumeText, job.preferredSkills);
      const experienceYears = extractExperienceYears(resumeText);
      const education = extractEducation(resumeText);

      const { total, breakdown } = computeScore({
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        matchedRequired,
        matchedPreferred,
        candidateExperience: experienceYears,
        minExperience: job.minExperienceYears,
        education,
      });

      const allMatchedSkills = [...matchedRequired, ...matchedPreferred];

      await prisma.candidate.create({
        data: {
          jobId: job.id,
          name,
          rawResumeText: resumeText,
          extractedSkills: allMatchedSkills,
          extractedExperienceYears: experienceYears,
          extractedEducation: education,
          fitScore: total,
          scoreBreakdown: breakdown,
          processedAt: new Date(),
        },
      });

      inserted++;
    }

    return NextResponse.json({ inserted, failedRows }, { status: 201 });
  } catch (error) {
    console.error("Candidate upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}