// app/api/user/login/route.ts
import { prisma } from "@/lib/db";
import { generateToken, SetCookie } from "@/lib/generateToken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { JwtPayload } from "@/lib/generateToken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.employee.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: `${user.firstname} ${user.lastname}`
    };

    const cookie = SetCookie(payload);

    return NextResponse.json(
      { 
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: `${user.firstname} ${user.lastname}`
        }
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}