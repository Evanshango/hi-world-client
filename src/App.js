import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Container} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import {AuthProvider} from "./context/auth";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import MenuBar from "./components/MenuBar";
import SinglePost from "./components/pages/SinglePost";
import AuthRoute from "./util/AuthRoute";

function App() {
  return (
      <AuthProvider>
          <Router>
              <Container>
                  <MenuBar/>
                  <Route exact path='/' component={Home}/>
                  <AuthRoute exact path='/login' component={Login}/>
                  <AuthRoute exact path='/register' component={Register}/>
                  <Route exact path='/posts/:postId' component={SinglePost}/>
              </Container>
          </Router>
      </AuthProvider>
  )
}

export default App;
