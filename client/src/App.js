import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

import { BiArrowBack } from 'react-icons/bi'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import ListArticles from './pages/listArticles'
import EditArticle from './pages/editArticle'

function App () {
  const [openArticles, setOpenArticles] = useState([])
  const [openArticleDetails, setOpenArticleDetails] = useState()
  const [socket, setSocket] = useState()

  useEffect(() => {
    setSocket(io('http://localhost:3000'))
    
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) 
      return

    socket.on('openArticles', data => {
      console.log('update open articles with ', data)
      setOpenArticles(data)
    })

    socket.on('message', data => {
      const details = JSON.parse(data);
      console.log("got message: ", details)
      setOpenArticleDetails(details)
    })

  }, socket)

  return (
    <Router>
      <div className='App'>
        <header className='header'>
          <Link to='/' className='header-back'>
            <BiArrowBack size={16} style={{ marginRight: '4px' }} />
            Back
          </Link>
          <div>
            User: {socket?.id}
          </div>
        </header>
        <Switch>
          <Route path='/article/:id'>
            <EditArticle socket={socket} articleDetails={openArticleDetails}/>
          </Route>
          <Route path='/'>
            <ListArticles socket={socket} openArticles={openArticles} />
          </Route>
        </Switch>
      </div>
      <div />

    </Router>

  )
}

export default App
