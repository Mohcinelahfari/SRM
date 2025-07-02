import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(request : NextResponse){
    try {
        (await cookies()).delete("jwtToken");
        return NextResponse.json({message : "logout"}, {status : 200})
    } catch (error) {
        
    }
}