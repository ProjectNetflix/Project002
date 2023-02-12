// import logo from './logo.svg';
// import './App.css';
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Login from './components/login'
import SignUp from './components/signup'

import Navbar from "./components/Navbar"
import User from "./components/User"
import Movie from "./components/Movie"
import Home from "./components/Home"
import MovieEx from "./components/Movie_ex"

function App() {

  // return (
  //   <Router>
  //     <div>
  //       <Switch>
  //         <Route path="/" component={}={Signin} exact />
  //         <Route path="/home" component={Home} exact />
  //         <Route path="/user" component={User} />
  //         <Route path="/movie" component={Movie} />

  //       </Switch>

  //     </div>
  //   </Router>
  // );

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>
              positronX
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}


export default App;
