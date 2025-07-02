import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { post: true, leaveRequests: true },
    });
    if (!employee) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error) {
    console.error(`GET /employees/${id} error:`, error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, address, password, postId, datedebut } = body;

    if (!firstname || !lastname || !email || !postId || !datedebut) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // Prepare data for update, hashing password if provided
    const updateData: any = {
      firstname,
      lastname,
      email,
      phone,
      address,
      postId,
      datedebut: new Date(datedebut),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error(`PUT /employees/${id} error:`, error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(`DELETE /employees/${id} error:`, error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
