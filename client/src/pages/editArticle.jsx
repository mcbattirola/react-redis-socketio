import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticleById, updateArticle } from '../api/articles'
import PageTitle from '../components/pageTitle'
import { CgDanger } from 'react-icons/cg'

function EditArticle ({ socket, openArticles }) {
  const { id } = useParams()

  const [article, setArticle] = useState({ name: '', content: '' })

  useEffect(() => {
    getArticleById(id).then(article => {
      setArticle(article)
    })

    console.log('emmit lock on', id)
    socket.current?.emit('lockArticle', id)

    socket.current?.on(`article:${id}`, data => {
      console.log(`on article:${id} got data: ${data}`)
    })

    return () => {
      console.log('edit article cleanup on', id)
      socket.current.emit('unlockArticle', id)
    }
  }, [id])

  const [isLocked, setIsLocked] = useState(false)
  useEffect(() => {
    const openInstance = openArticles?.find(a => a.article === id)
    if (!openInstance) {
      socket.current?.emit('lockArticle', id)
    } else {
      setIsLocked(openInstance && openInstance.user !== socket.current?.id)
    }
  }, [id, openArticles])

  const handleChange = (event, field) => {
    setArticle({
      ...article,
      [field]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateArticle(id, article)
  }

  return (
    <form onSubmit={handleSubmit} className='form-edit'>
      <PageTitle title={article.name} />

      {isLocked ? <div className='edit-locked'> <CgDanger size={20} className='edit-locked-icon' /> Este arquivo já está sendo editado </div> : ''}

      <div>
        <label htmlFor='article-title'>Titulo</label>
        <input disabled={isLocked} type='text' id='article-title' onChange={(e) => handleChange(e, 'name')} value={article.name} />
      </div>

      <div>
        <label htmlFor='article-content'>Artigo</label>
        <textarea rows='5' disabled={isLocked} id='article-content' onChange={(e) => handleChange(e, 'content')} value={article.content} />
      </div>

      <input className='main-button form-edit-submit' type='submit' value='Salvar' />
    </form>
  )
}

export default EditArticle
