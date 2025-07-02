import React from 'react'

function ArticlesList({ article }: { article: any }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p> {/* Assuming your article has a content field */}
    </div>
  )
}

export default ArticlesList
