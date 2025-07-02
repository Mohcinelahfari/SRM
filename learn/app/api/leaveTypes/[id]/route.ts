import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const leaveType = await prisma.leaveType.findUnique({ where: { id: parseInt(params.id) }, include: { leaveRequests: true } });
    if (!leaveType) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(leaveType);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await request.json();
    const { name, maxDays, carryForward } = body;
    if (!name || maxDays == null) {
      return NextResponse.json({ message: "Name and maxDays required" }, { status: 400 });
    }

    const updated = await prisma.leaveType.update({
      where: { id: parseInt(params.id) },
      data: { name, maxDays, carryForward: carryForward ?? false },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    await prisma.leaveType.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}