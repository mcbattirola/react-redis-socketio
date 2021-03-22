import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import { BiArrowBack } from "react-icons/bi";


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ListArticles from './pages/listArticles';
import EditArticle from './pages/editArticle';

function App() {
  const [openArticles, setOpenArticles] = useState([]);
  let socket = useRef();
    
  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.on("openArticles", data => {
        console.log("update open articles with ", data)
        setOpenArticles(data);
    });

    return () => {
      socket.current.disconnect();
    }

  }, []);

  return (
    <Router>
      <div className="App">
        <header className="header">
          <Link to="/" className="header-back">
            <BiArrowBack size={16} style={{marginRight: "4px"}}/>
             Back
          </Link>
        </header>
        <Switch>
          <Route path="/article/:id">
            <EditArticle socket={socket} openArticles={openArticles} />
          </Route>
          <Route path="/">
            <ListArticles socket={socket} openArticles={openArticles} />
          </Route>
        </Switch>
      </div>
      <div>
      </div>

    </Router>

  );
}

export default App;
