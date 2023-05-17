import React, { useState } from 'react'
import './style.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("userId", data.userId);
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "./";
        } else {
          alert(data.status);
        }
      });
  }

  return (

    <div className="signin-form-container">
      <div className='home-header'>
        <h1>
          Welcome To JoyFlix
        </h1>
      </div>

      <form className="container-login" onSubmit={handleSubmit}>
        <div className="signin-form-content">
          <h3 className="signin-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email" required
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(e) => (setEmail(e.target.value))}
            />
          </div>

          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password" required
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
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
            <p className="forgot-password text-right">
              <a href="/resetpass">Forgot Password</a>
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            Sing In
          </button>


          <p className="forgot-password text-right">
            Have not an account yet? <a href="/signup">Sign Up</a>
          </p>

        </div>

      </form>
    </div>

  );
}


export default SignIn;