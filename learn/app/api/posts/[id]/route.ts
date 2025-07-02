// /app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";


export async function GET(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(params.id) }, include: { department: true, employees: true } });
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await request.json();
    if (!body.title || !body.departmentId) {
      return NextResponse.json({ message: "Title and departmentId required" }, { status: 400 });
    }
    const updated = await prisma.post.update({ where: { id: parseInt(params.id) }, data: { title: body.title, departmentId: body.departmentId } });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    await prisma.post.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
