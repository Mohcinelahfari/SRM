import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  id: number;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const jwtToken = request.cookies.get("jwtToken");
    const token = jwtToken?.value as String


    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (decoded.id === user.id) {
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ message: "Your profile has been deleted" }, { status: 200 });
    }

    return NextResponse.json({ message: "Only the user can delete their profile" }, { status: 403 });
  } catch (error) {
    console.error("DELETE /api/user/:id error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}





// Typage du paramètre `params`
interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "The user was not found" },
        { status: 404 }
      );
    }

    const jwtToken = request.cookies.get("jwtToken");
    const token = jwtToken?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token missing" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    if (decoded.id !== user.id) {
      return NextResponse.json(
        { message: "Unauthorized to view user details" },
        { status: 403 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}




export async function PUT(request: NextRequest, { params }) {
try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(params.id) } })

  if (!user) {
    return NextResponse.json({ message: "User Not Found" })
  }

  const jwtToken = request.cookies.get("jwtToken")
  const token = jwtToken?.value as String

  if (!token) {
    return NextResponse.json({ message: "Token not found" }, { status: 401 })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.id !== user.id) {
    return NextResponse.json({ message: "Unauthorized to view user details" },
      { status: 403 })
  }

  const body = await request.json()


  if (body.password) {
    const salt = await bcrypt.genSalt(10)
    body.password = await bcrypt.hash(body.password, salt)

  }

  const UpdateProfile = await prisma.user.update({
    where: { id: parseInt(params.id) },
    data: {
      name: body.name,
      email: body.email,
      password: body.password
    },
    select : {
      name : true,
      email : true,
      createdAt : true,
      isAdmin : true
    }
  })
  return NextResponse.json(UpdateProfile, {status : 200})


} catch (error) {
  return NextResponse.json({message : "error"}, {status : 404})  
}
}