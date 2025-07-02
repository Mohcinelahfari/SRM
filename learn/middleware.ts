// middleware.ts
import { NextRequest, NextResponse } from "next/server";


export function middleware(request: NextRequest) {
     
  const jwtToken = request.cookies.get('jwtToken');
  const token = jwtToken?.value as String

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

  
}

export const config ={
    matcher : ["/api/user/profile/:path*"]
}