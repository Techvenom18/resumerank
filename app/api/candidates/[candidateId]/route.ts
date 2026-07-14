import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "SHORTLISTED", "REJECTED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { job: true },
    });

    if (!candidate || candidate.job.userId !== session.user.id) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ candidate: updated });
  } catch (error) {
    console.error("Update candidate status error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}