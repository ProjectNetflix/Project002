import React, { useState } from 'react'
import './Style.css'
import './SignUp.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const SignUp = () => {

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {

    e.preventDefault();

    //const { fname, lname, email, password } = this.state;
    // console.log(fname, lname, email, password);

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
        // console.log(data, "userRegister");
        if (data.status === "ok") {

          // console.log(data)
          MySwal.fire({
            text: 'Success',
            // icon: 'success',
            showConfirmButton: false,
            timer: 2000
          })

          //alert("signup successful");
          window.location.href = "./signin";
        } else {

          MySwal.fire({
            text: data.status,
            // icon: 'error',
            showConfirmButton: true,
            //timer: 2000
          })

          // alert(data.status);
        }
      });
  }

  return (

    <div className="container-signup">

      <div className="home-header">
        <img src="3-bl.png" width={"200px"}/>
        {/* <h1> Welcome </h1> */}
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form-content">
          <h3 className="signup-form-title">Sign Up</h3>

          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              type="text" required
              className="form-control mt-1"
              // placeholder="First name"
              onChange={(e) => (setFname(e.target.value))}
            />
          </div>

          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              type="text" required
              className="form-control mt-1"
              // placeholder="Last name"
              onChange={(e) => (setLname(e.target.value))}
            />
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email" required
              className="form-control mt-1"
              // placeholder="Enter email"
              onChange={(e) => (setEmail(e.target.value))}
            />
          </div>

          <div className="form-group mt-3">
            <label>Password</label><small> (at least 8 character)</small>
            <input
              type="password" required
              className="form-control mt-1"
              // placeholder="Enter password"
              onChange={(e) => (setPassword(e.target.value))}
            />
          </div>

          <div className="submit mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>

          <div className="forgot-password text-right">
            Already registered? <a href="/signin">Sign In</a>
          </div>

        </div>
      </form>
    </div>
  );
}

export default SignUp;