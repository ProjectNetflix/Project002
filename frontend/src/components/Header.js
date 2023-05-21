import { AiOutlineBars, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BsFillPersonFill, BsFillChatDotsFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
// import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import MenuData from "../data/MenuData";
import './Navb.css'

export default function Header() {

    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => setShowMenu(!showMenu)

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
                    alert("Token expired signin again");
                    window.localStorage.clear();
                    window.location.href = "./signin";
                } else {
                    setUserData(data.data);
                }
            });
    }, []);

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/signin";
    };

    return (

        <div className='container' >
            <nav class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-5 ">
                <div className="menu-text">
                    <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 justify-content-center">
                        <li><a href="/" class="nav-link px-2 link-secondary">Home</a></li>
                        <li><a href="/profile" class="nav-link px-2 link-dark">Features</a></li>
                        <li><a href="/movie" class="nav-link px-2 link-dark">Pricing</a></li>
                        <span></span>
                        <button type="button" class="btn btn-outline-primary me-2">Sign Out</button>

                    </ul>
                </div>


                <div class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" >
                    <input type="search" class="form-control form-control-dark" placeholder="Search..." label="Search" />
                </div>

            </nav>
        </div>
    )
}