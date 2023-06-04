import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import SignIn from './components/SignIn'
import SignUp from './components/Signup'
import Movie from './components/Movie'
import Home from './components/Home'
import Profile from './components/Profile'
// import Profile from './components/Profile1'
import Follow from './components/Follow'
import Playlist from './components/Playlist'


function App() {

  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (

    <Router>
      <Switch>
        <Route path="/signin" component={isLoggedIn === "false" ? Home : SignIn } />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} exact />
        <Route path="/profile" component={Profile} />
        <Route path="/movie" component={Movie} />
        <Route path="/follow" component={Follow} />
        <Route path="/playlist" component={Playlist} />

      </Switch>

    </Router>
  );

}

export default App
