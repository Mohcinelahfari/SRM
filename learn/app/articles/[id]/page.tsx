import React from 'react'
interface SingleAtricle {
    params : {id: number}
}
const  SingleArticle =async ({params} : SingleAtricle) => {
    console.log(params);
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
    const article = await response.json()
  return (
    <div>SingleArticle
        <div>
            <h1>{article.title}</h1>
        </div>
    </div>
  )
}

export default SingleArticle