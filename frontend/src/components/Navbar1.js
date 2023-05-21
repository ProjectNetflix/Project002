import "./topbar.css";
import { BiMovie } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BsFillPersonFill, BsFillChatDotsFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import MenuData from "../data/MenuData";
import './Navbar.css'
import { IconContext } from "react-icons";


export default function Navbar() {

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

        <div>
            <div class="p-2 bg-dark text-white">
                <div class="container">
                    <div class="d-flex flex-wrap align-items-center justify-content-center ">
                        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 bg-bs-body-bg">


                            {MenuData.map((menu, index) => {

                                return (
                                    <li key={index}>
                                        <a href={menu.path} class="nav-link text-white "> <IconContext.Provider value={{ color: "white", size: '30px' }}> {menu.icon}</IconContext.Provider> </a>
                                        <a href={menu.path} class="nav-link text-white py-1">{menu.title}</a>
                                    </li>
                                )

                            })}

                            {/* <li>
                            <a href="/" class="nav-link px-2 text-white"> <IconContext.Provider value={{ color: "white", size: '25px' }}> <AiOutlineHome /></IconContext.Provider> </a>
                            <a href="/" class="nav-link px-2 text-white">Home</a>
                        </li>

                        <li>
                            <a href='/profile' class="nav-link px-2 text-white"> <IconContext.Provider value={{ color: "white", size: '25px' }}> <FaRegUser /></IconContext.Provider> </a>
                            <a href="/profile" class="nav-link px-2 text-white">Profile</a>
                        </li>

                        <li>
                            <a href='/movie' class="nav-link px-2 text-white"> <IconContext.Provider value={{ color: "white", size: '25px' }}> <BiMovie /></IconContext.Provider> </a>
                            <a href="/movie" class="nav-link px-2 text-white">Movie</a>
                        </li> */}


                        </ul>

                        {/* <form class=" align-items-center col-12 col-lg px-3">
                        <input class="form-control form-control-dark " placeholder="Search..." label="Search" />
                    </form> */}

                        <a href='/profile' class="nav-link px-3  d-flex justify-content-center text-white">  {userData.fname}  {userData.lname} </a>

                        <div class="text-end">
                            <button type="button" class="btn btn-outline-primary" onClick={logOut}>Sign Out</button>
                        </div>

                    </div>
                </div>
            </div >
        </div>

    )
}