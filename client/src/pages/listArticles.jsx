import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {getArticles} from '../api/articles';

function ListArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(()=> {
    getArticles()
    .then( data => {
      setArticles(data)
    })
  }, [])

  return (
    <>
      <h1 className="title" >Articles</h1>
      <ul className="articles-list">
        {
          articles?.map(article => {
            return (
              <li className="article" key={article.id}>
                <Link to={`/article/${article.id}`}>{article.name}</Link>
              </li>
            )
          })
        }
      </ul>
    </>
    )
}

export default ListArticles;