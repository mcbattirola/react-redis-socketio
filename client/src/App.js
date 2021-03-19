import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ListArticles from './pages/listArticles';
import EditArticle from './pages/editArticle';

function App() {
  const [response, setResponse] = useState("");
  let socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.on("openArticles", data => {
      setResponse(data);
    });

    socket.current.emit('editArticle', 4);
  }, []);

  const emmitEditArticle = ()  => {
    socket.current.emit('editArticle', 5);
  }


  return (
    <Router>
      <div className="App">
        <header>
          <Link to="/">Back</Link>
        </header>
        <Switch>
          <Route path="/article/:id">
            <EditArticle />
          </Route>
          <Route path="/">
            <ListArticles />
          </Route>
        </Switch>
      </div>
      <div>
        Open articles: {response}
      </div>
      <div>
        <button onClick={emmitEditArticle}>aqui</button>
      </div>

    </Router>

  );
}

export default App;
