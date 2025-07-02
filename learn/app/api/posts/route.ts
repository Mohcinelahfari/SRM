// /app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";


export async function GET(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const posts = await prisma.post.findMany({ include: { department: true, employees: true } });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await request.json();
    if (!body.title || !body.departmentId) {
      return NextResponse.json({ message: "Title and departmentId required" }, { status: 400 });
    }
    const post = await prisma.post.create({ data: { title: body.title, departmentId: body.departmentId } });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
