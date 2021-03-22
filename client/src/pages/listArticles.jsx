import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {getArticles} from '../api/articles';
import { AiFillLock } from "react-icons/ai";
import PageTitle from '../components/pageTitle';

function ListArticles({openArticles}) {
  const [articles, setArticles] = useState([]);

  useEffect(()=> {
    getArticles()
    .then( data => {
      setArticles(data)
    })
  }, [])

  return (
    <> {console.log("openArticles: ", openArticles)}
    <PageTitle title="Articles" />
      
      <ul className="articles-list">
        {
          articles?.map(article => {
            const openInstance = openArticles.find(a => parseInt(a.article) === article.id)
            console.log("artigo ", article.id, " is open? ", openInstance)
            return (
              <li className="article" key={article.id}>
                <Link to={`/article/${article.id}`}>{article.name}</Link> { openInstance ? <AiFillLock size={16} /> : ""}
              </li>
            )
          })
        }
      </ul>
    </>
    )
}

export default ListArticles;