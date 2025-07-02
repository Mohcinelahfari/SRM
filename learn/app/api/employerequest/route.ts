import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { verifyAdmin } from "@/lib/adminAuth"; // still used for GET

function monthsBetween(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getFullYear() * 12 +
    dateTo.getMonth() -
    (dateFrom.getFullYear() * 12 + dateFrom.getMonth())
  );
}

export async function POST(request: NextRequest) {
  // 1. Grab the JWT from cookie
  const token = request.cookies.get("jwtToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
  }

  // 2. Verify & decode
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // 3. Block admins here
  if (decoded.isAdmin) {
    return NextResponse.json({ message: "Admins cannot create leave requests" }, { status: 403 });
  }

  // 4. Lookup employee by their own id
  const employee = await prisma.employee.findUnique({
    where: { id: decoded.id },
  });
  if (!employee) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  // 5. Parse and validate body
  const { leaveTypeId, startDate, endDate, reason } = await request.json();
  if (!leaveTypeId || !startDate || !endDate) {
    return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
  }

  // 6. Seniority check (6 months)
  const diff = monthsBetween(new Date(employee.datedebut), new Date());
  if (diff < 6) {
    return NextResponse.json(
      { message: "You must have at least 6 months seniority to request leave" },
      { status: 403 }
    );
  }

  // 7. Create request
  try {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveTypeId: parseInt(leaveTypeId),
        startDate: start,
        endDate: end,
        reason: reason || null,
        status: "PENDING",
      },
    });
    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (e) {
    console.error("Error creating leave request:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


