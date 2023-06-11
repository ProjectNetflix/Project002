import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import SignIn from './components/SignIn'
import SignUp from './components/Signup'
import Movie from './components/Movie'
import Home from './components/Home'
import Profile from './components/Profile'
import Playlist from './components/Playlist'
import Follow from './components/Follow'
import PlaylistList from './components/PlaylistList'


function App() {

  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (

    <Router>
      <Switch>
        <Route path="/signin" component={isLoggedIn === "false" ? Home : SignIn } />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} exact />
        <Route path="/profile" component={Profile} />
        <Route path="/playlist/:id" component={Playlist} />
        <Route path="/movie" component={Movie} />
        <Route path="/follow/:id" component={Follow} />
        {/* <Route path="/playlist" component={PlaylistList} /> */}

      </Switch>

    </Router>
  );

}

export default App
