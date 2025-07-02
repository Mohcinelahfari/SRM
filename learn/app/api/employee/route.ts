import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const employees = await prisma.employee.findMany({ include: { post: true, leaveRequests: true } });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// export async function POST(request: NextRequest) {
//   const adminCheck = await verifyAdmin(request);
//   if (adminCheck instanceof NextResponse) return adminCheck;

//   try {
//     const body = await request.json();
//     const { firstname, lastname, email, phone, address, password, postId, datedebut } = body;

//     if (!firstname || !lastname || !email || !password || !postId) {
//       return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
//     }

//     const employee = await prisma.employee.create({
//       data: { firstname, lastname, email, phone, address, password, postId , datedebut},
//     });

//     return NextResponse.json(employee, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   const adminCheck = await verifyAdmin(request);
//   if (adminCheck instanceof NextResponse) return adminCheck;

//   try {
//     const body = await request.json();
//     const { firstname, lastname, email, phone, address, password, postId, datedebut } = body;

//     if (!firstname || !lastname || !email || !password || !postId || !datedebut) {
//       return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const employee = await prisma.employee.create({
//       data: {
//         firstname,
//         lastname,
//         email,
//         phone,
//         address,
//         password: hashedPassword,
//         postId,
//         datedebut,
//       },
//     });

//     return NextResponse.json(employee, { status: 201 });
//   } catch (error) {
//     console.error("POST /employees error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, address, password, postId, datedebut } = body;

    if (!firstname || !lastname || !email || !password || !postId || !datedebut) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: {
        firstname,
        lastname,
        email,
        phone,
        address,
        password: hashedPassword,
        postId,
        datedebut: new Date(datedebut),
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
