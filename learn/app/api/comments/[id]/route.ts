import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function PUT(request: NextRequest, { params }) {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(params.id) } })

    if (!comment) {
        return NextResponse.json({ message: "Comment not found" })
    }


    const jwtToken = request.cookies.get("jwtToken")
    const token = jwtToken?.value as String

    if (!token) {
        return NextResponse.json({ message: "Token no Provide" }, { status: 401 })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    if (user.id !== comment.userId) {
        return NextResponse.json({ message: " you are not allow , access denied" }, { status: 403 })
    }


    const body = await request.json()

    const updateComment =await prisma.comment.update({
        where : {id :  parseInt(params.id)},
        data : {
            content : body.content
        }
    })

    return NextResponse.json(updateComment, {status : 200})
}