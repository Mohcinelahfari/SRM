import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface CeateNewPostProps {
    title : string,
    description : string
}

export async function GET(request: NextRequest){
    try {
        const articles = await prisma.article.findMany(); 
    return NextResponse.json(articles, {status : 200})

    } catch (error) {
            console.error("Erreur POST article :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CeateNewPostProps;

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Titre et description obligatoires" },
        { status: 400 }
      );
    }

    const newArticle = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
        user: {
          connect: { id: body.userId }, // 🔴 Remplace "1" par l'ID réel de l'utilisateur (à venir du token ou session)
        },
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Erreur POST article :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}