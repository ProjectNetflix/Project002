import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import Login from './components/Login'
import SignUp from './components/Signup'
import Movie from './components/Movie'
import Home from './components/Home'
import User from './components/User'
import Firstpage from './components/Firstpage'

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/home" component={Home}/>
          <Route path="/" component={Firstpage} exact />
          <Route path="/user" component={User} />
          <Route path="/movie" component={Movie} />

        </Switch>

      </div>
    </Router>
  );

}

export default App
