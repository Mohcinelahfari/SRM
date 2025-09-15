import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

// GET salaire by ID
// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const salaire = await prisma.salaire.findUnique({
//     where: { id: Number(params.id) },
//     include: { employee: true },
//   });
//   return NextResponse.json(salaire);
// }

// UPDATE salaire
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { amount, employeeId } = await req.json();
  const salaire = await prisma.salaire.update({
    where: { id: Number(params.id) },
    data: { amount, employeeId },
  });
  return NextResponse.json(salaire);
}

// DELETE salaire
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.salaire.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Deleted successfully" });
}


export async function GET(request: NextRequest) {
  try {
    // 1. Get JWT token from cookies
    const token = request.cookies.get("jwtToken")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const userId = parseInt(decoded.id);

    // 3. Get user's salaires
    const salaires = await prisma.salaire.findMany({
      where: { employeeId: userId },
      include: {
        employee: {
          select: { firstname: true, lastname: true }
        }
      },

    });

    return NextResponse.json(salaires);
  } catch (error) {
    console.error("Error fetching user salaires:", error);
    return NextResponse.json(
      { message: "Failed to fetch salaires" },
      { status: 500 }
    );
  }
}
