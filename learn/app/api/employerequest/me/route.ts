// app/api/leaveRequests/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

// (reuse your seniority util if you want)
export async function GET(request: NextRequest) {
  // 1. Grab & verify JWT
  const token = request.cookies.get("jwtToken")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // 2. Only employees (non-admins) use this route
  if (decoded.isAdmin) {
    return NextResponse.json({ message: "Admins must use the main list endpoint" }, { status: 403 });
  }

  // 3. Fetch just *their* leave requests
  try {
    const myRequests = await prisma.leaveRequest.findMany({
      where: { employeeId: decoded.id },
      include: {
        leaveType: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(myRequests, { status: 200 });
  } catch (e) {
    console.error("Error fetching my leave requests:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
