import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

function monthsBetween(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getFullYear() * 12 +
    dateTo.getMonth() -
    (dateFrom.getFullYear() * 12 + dateFrom.getMonth())
  );
}

export async function POST(request: NextRequest) {


  try {
    const body = await request.json();
    const { employeeId, leaveTypeId, startDate, endDate, reason, status } = body;

    // ✅ Step 1: Validate
    if (!employeeId || !leaveTypeId || !startDate || !endDate) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // ✅ Step 2: Validate employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      select: { datedebut: true },
    });

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    const now = new Date();
    const datedebut = new Date(employee.datedebut);
    const diffMonths = monthsBetween(datedebut, now);

    if (diffMonths < 6) {
      return NextResponse.json(
        { message: "Employee must have at least 6 months of seniority to request leave." },
        { status: 403 }
      );
    }

    // ✅ Step 4: Create
    const newLeaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: parseInt(employeeId),
        leaveTypeId: parseInt(leaveTypeId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || null,
        status: status || "PENDING",
      },
    });

    return NextResponse.json(newLeaveRequest, { status: 201 });
  } catch (error) {
    console.error("Leave request creation error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function GET(request : NextRequest) {
  try {

    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        leaveType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leaveRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}
