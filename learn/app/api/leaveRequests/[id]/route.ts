import { verifyAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const { employeeId, leaveTypeId, startDate, endDate, reason, status } = body;

    // Validation
    if (!employeeId || !leaveTypeId || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        employeeId,
        leaveTypeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    // 1. Get JWT token from cookies
    const token = request.cookies.get('jwtToken')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const userId = parseInt(decoded.id);

    // 3. Get user's leave requests
    const leaves = await prisma.leaveRequest.findMany({
      where: { employeeId: userId },
      include: {
        leaveType: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching user leaves:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leaves' },
      { status: 500 }
    );
  }
}