import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";


export async function POST(request : NextRequest) {

    const jwtToken = request.cookies.get("jwtToken")
    const token =  jwtToken?.value as String

    if(!token){
        return NextResponse.json({message : "Token no Provide"}, {status : 401})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded || !decoded.id){
        return NextResponse.json({message : "Token invalid"}, {status : 403})
    }


    const body  = await request.json()

    const NewComment = await prisma.comment.create({
        data : {
            content : body.content,
            userId : decoded.id,
            articleId : body.articleId
        }
    })

    return NextResponse.json(NewComment, {status : 201})


}



export async function GET(request : NextRequest) {
        const jwtToken = request.cookies.get("jwtToken")
    const token =  jwtToken?.value as String

    if(!token){
        return NextResponse.json({message : "Token no Provide"}, {status : 401})
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    if(!user.isAdmin){
        return NextResponse.json({message : "Only Admin Can see"}, {status : 403})
    }

    const comments = await prisma.comment.findMany();
    return NextResponse.json({comments},{status : 200})

}