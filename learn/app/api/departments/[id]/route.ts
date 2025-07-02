import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { verifyAdmin } from "@/lib/adminAuth";


export async function GET(request: NextRequest, { params } ) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const department = await prisma.department.findUnique({
    where: { id: parseInt(params.id) }
  });

  if (!department) return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json(department);
}

export async function PUT(request: NextRequest, { params } ) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ message: "Name required" }, { status: 400 });
  }

  const updated = await prisma.department.update({
    where: { id: parseInt(params.id) },
    data: { name: body.name },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params } ) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  await prisma.department.delete({ where: { id: parseInt(params.id) } });

  return NextResponse.json({ message: "Deleted" });
}
