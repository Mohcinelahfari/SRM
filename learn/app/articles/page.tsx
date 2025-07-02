import ArticlesList from '@/components/ArticlesList';
import React from 'react'

 async function AllPAgeArticles() {

  const response = await fetch('http://localhost:3000/api/articles');
  const articles = await response.json()
  return (
    
    <div>
      {articles.map((article : any) => (
        <ArticlesList key={article.id} article={article} />
      ))}
    </div>
  )
}

export default AllPAgeArticles
