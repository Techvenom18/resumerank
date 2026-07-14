import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requiredSkills: z.array(z.string()).min(1, "Add at least one required skill"),
  preferredSkills: z.array(z.string()).optional().default([]),
  minExperienceYears: z.number().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, requiredSkills, preferredSkills, minExperienceYears } =
      parsed.data;

    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        title,
        description,
        requiredSkills,
        preferredSkills,
        minExperienceYears: minExperienceYears ?? null,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("List jobs error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}