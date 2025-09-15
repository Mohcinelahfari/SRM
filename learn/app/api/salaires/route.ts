import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// GET all salaires
export async function GET() {
  const salaires = await prisma.salaire.findMany({
    include: { employee: true },
  });
  return NextResponse.json(salaires);
}

// POST new salaire
export async function POST(req: Request) {
  const { amount, employeeId } = await req.json();
  const salaire = await prisma.salaire.create({
    data: { amount, employeeId },
  });
  return NextResponse.json(salaire);
}
