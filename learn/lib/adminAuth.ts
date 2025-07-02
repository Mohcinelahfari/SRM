import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyAdmin(request: NextRequest): Promise<{ id: string; isAdmin: boolean } | NextResponse> {
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken?.value;
  if (!token) return NextResponse.json({ message: "Token not provided" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    if (!decoded.isAdmin) {
      return NextResponse.json({ message: "Only ADMIN access" }, { status: 403 });
    }
    return decoded;
  } catch (error) {
    return NextResponse.json({ message: "Token invalid" }, { status: 403 });
  }
}
