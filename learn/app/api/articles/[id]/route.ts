
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"


// export async function GET(request : NextRequest, props : any){
//     console.log(props.params);
//      return NextResponse.json({message : "ok"})
// }



export async function GET(request: NextRequest, { params }) {
  try {
    const singleArticle = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        comments: {
          include : {
            user : true
          }
        },
        user : true

      }
    })
    if (!singleArticle) {
      return NextResponse.json({ meaage: "article not found" }, { status: 404 })
    }

    return NextResponse.json(singleArticle, { status: 200 })
  } catch (error) {
    console.error('Erreur interne :', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }

}

// // app/api/articles/[id]/route.ts

// import { NextResponse } from 'next/server'

// // Simule une base de données
// const fakeArticles = [
//   { id: '1', title: 'Article 1', content: 'Contenu 1' },
//   { id: '2', title: 'Article 2', content: 'Contenu 2' },
// ]

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params

//     const article = fakeArticles.find((a) => a.id === id)

//     if (!article) {
//       return NextResponse.json(
//         { error: 'Article non trouvé' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(article)
//   } catch (error) {
//     console.error('Erreur interne :', error)
//     return NextResponse.json(
//       { error: 'Erreur serveur' },
//       { status: 500 }
//     )
//   }
// }




// export async function PUT(request :  NextRequest, {params} ) {
// try {
//         const article = await prisma.article.findUnique({
//         where : {id : parseInt(params.id)}
//     });

//     if(!article){
//         return NextResponse.json({message : "article not found"}, {status : 404})
//     }

//     const body = await request.json()

//     const articleUpdate = prisma.article.update({
//         where : {id : parseInt(params.id)},
//         data : {
//             title : body.title,
//             description : body.description
//         }
//     });

//     return NextResponse.json(articleUpdate, {status : 200})
// } catch (error) {
//     console.log("ERROR in your update");
//     return NextResponse.json(error, {status : 404})

// }
// }

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);

    // ✅ 1. Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    // ✅ 2. Get data from request body
    const body = await request.json();
    const { title, description } = body;

    // ✅ 3. Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("❌ ERROR in PUT /api/articles/[id]:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}




export async function DELETE(request: NextRequest, { params }) {
  try {
    const articleId = await prisma.article.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!articleId) {
      return NextResponse.json({ message: "article not found" }, { status: 404 })
    }

    await prisma.article.delete({
      where: { id: parseInt(params.id) }

    })
    return NextResponse.json({ message: "article delete" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "eroor" }, { status: 404 })

  }
}