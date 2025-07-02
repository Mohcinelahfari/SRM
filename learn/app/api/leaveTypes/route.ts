import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {


  try {
    const leaveTypes = await prisma.leaveType.findMany({ include: { leaveRequests: true } });
    return NextResponse.json(leaveTypes);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await request.json();
    const { name, maxDays, carryForward } = body;

    if (!name || maxDays == null) {
      return NextResponse.json({ message: "Name and maxDays required" }, { status: 400 });
    }

    const leaveType = await prisma.leaveType.create({
      data: { name, maxDays, carryForward: carryForward ?? false },
    });

    return NextResponse.json(leaveType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}