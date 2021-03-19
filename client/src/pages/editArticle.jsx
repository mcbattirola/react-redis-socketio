import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById, updateArticle } from '../api/articles';

function EditArticle() {
    let { id } = useParams();
    const [article, setArticle] = useState({});

    useEffect(() => {
        getArticleById(id).then( article => {
            setArticle(article)
        });
    }, [id])

    const handleChange = (event, field) => {
        setArticle({
            ...article, 
            [field]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        updateArticle(id, article);        
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{article.name}</h1>

            <div>
                <label for="article-title">Titulo</label>
                <input type="text" id="article-title" onChange={(e) => handleChange(e, "name")} value={article.name} />
            </div>

            <div>
                <label for="article-content">Artigo</label>
                <textarea id="article-content" onChange={(e) => handleChange(e, "content")} value={article.content} />
            </div>

            <input type="submit" value="Salvar" />
        </form>
    )
}

export default EditArticle;