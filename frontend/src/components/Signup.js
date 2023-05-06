import React, { Component, useState } from 'react'
import './style.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { fname, lname, email, password } = this.state;
    console.log( fname, lname, email, password);
    fetch("http://localhost:5000/signup", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {

          // console.log(data)
          MySwal.fire({
            html: <strong>successful</strong>,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          

          alert("signup successful");
          window.location.href = "./login";
        } else {
          MySwal.fire({
            html: <strong>{data.status}</strong>,
            icon: 'error'
          })
            //alert(data.status);
        }
        /*alert("Signup Successful");
        window.location.href = "./login";*/



      });
  }
  render() {
    return (
      <div className="container-signup">

          <form className="signup-form" onSubmit={this.handleSubmit}>
        <div className="signup-form-content">
          <h1 className="signup-form-title">Sign Up</h1>
            
          <div className="form-group mt-3">
            <label>First name</label>
            <input
              type="text" required
              className="form-control mt-1"
              placeholder="First name"
              onChange={(e) => this.setState({ fname: e.target.value })}            />
          </div>
          

          <div className="form-group mt-3">
            <label>Last name</label>
            <input
              type="text" required
              className="form-control mt-1"
              placeholder="Last name"
              onChange={(e) => this.setState({ lname: e.target.value })}            />
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email" required
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(e) => this.setState({ email: e.target.value })}            />
          </div>

          <div className="form-group mt-3">
            <label>Password</label><small> (ระบุอย่างน้อย 8 ตัว)</small>
            <input
              type="password" required
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e) => this.setState({ password: e.target.value })}            />
          </div>

          <div className="submit mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>

          <div className="forgot-password text-right">
              Already registered? <a href="/login">Sign In</a>
          </div>

        </div>
      </form>
    </div>
    );
  }
}