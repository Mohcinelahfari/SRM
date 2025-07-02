// lib/generateToken.ts
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string;
}

export function generateToken(jwtPayload: JwtPayload): string {
    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(jwtPayload, privateKey, {
        expiresIn: '30d'
    });
}

export function SetCookie(jwtPayload: JwtPayload): string {
    const token = generateToken(jwtPayload);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    return serialize("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: thirtyDaysInSeconds,
    });
}


export function getCurrentUser() {
  const token = cookies().get('jwtToken')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      isAdmin: boolean;
    };
  } catch {
    return null;
  }
}

export function isAdminUser() {
  const user = getCurrentUser();
  return user?.isAdmin || false;
}