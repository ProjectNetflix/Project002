import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './Navbar.css'

const Profile = () => {

    const [userData, setUserData] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/userData", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                if (data.data === "token expired") {
                    alert("Token expired sign in again");
                    window.localStorage.clear();
                    window.location.href = "./signin";
                } else {
                    setUserData(data.data);
                }
            });
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <form className="profile-form">
                    <h1  class="d-flex justify-content-sm-between mb-3 col-lg" >Profile</h1>
                    FirstName: {userData.fname} <br />
                    LastName: {userData.lname} <br />
                    Email: {userData.email} <br />
                </form>
            </div>
        </div>

    );
}
export default Profile;