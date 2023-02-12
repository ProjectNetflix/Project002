import React, { Component } from 'react'
import './style.css'

const Login = () => {
  return (

    <div className='card-form'>
      {/* <div>
        <img align="left" width="50%" height="100%" src="https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg" />
      </div> */}

      <div>
          <h1 className='home-header'>
            Welcome To JoyFlix
          </h1>
      </div>
      
      <form className='container-login'>
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </div>

        <div>
          <p className="signup text-left">
            Create Account <a href="/signup">Sign Up</a>
          </p>

          <p className="forgot-password text-right">
            Forgot <a href="#">Password?</a>
          </p>
        </div>

      </form>
    </div>
  )

}


export default Login;