import { prisma } from "@/lib/db";
import {  SetCookie } from "@/lib/generateToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {

    const body = await request.json()

    const user = await prisma.user.findUnique({
        where: { email: body.email }
    })

    if (user) {
        return NextResponse.json({ message: "user already existe" }, { status: 400 })
    }

    const slut = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(body.password, slut)
    const NewUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashPassword
        },
        select: {
            name: true,
            email: true,
            id: true,
            isAdmin: true
        }
    })



    const jwtPayload = { id: NewUser.id, name: NewUser.name, isAdmin: NewUser.isAdmin }

    const cookie = SetCookie(jwtPayload)

    return NextResponse.json({ ...NewUser, message : "Register & Authenticated" }, { status: 201, headers : {"Set-Cookie" : cookie} })

}