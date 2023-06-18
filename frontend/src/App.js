import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Movie from './components/Movie'
import Home from './components/Home'
import Profile from './components/Profile'
// import Playlist from './components/Playlist'
import Playlist from './components/PlaylistData'
import Follow from './components/Follow'
import PlaylistList from './components/PlaylistList'
import MovieData from './components/MovieData'

function App() {

  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (

    <Router>
      <Switch>
        <Route path="/signin" component={isLoggedIn ? SignIn : Home } />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} exact />
        <Route path="/profile" component={Profile} />
        <Route path="/playlist/:id" component={Playlist} />
        <Route path="/movie" component={Movie} />
        <Route path="/movies/:id" component={MovieData} />
        <Route path="/follow/:id" component={Follow} />

      </Switch>

    </Router>
  );

}

export default App
