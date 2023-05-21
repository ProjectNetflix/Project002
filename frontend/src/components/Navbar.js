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

    const requestOptions = {
        method: "POST",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            token: window.localStorage.getItem("token"),
            // userId: window.localStorage.getItem("userId"),
        }),
    };

    const getUser = async () => {
        let uid = localStorage.getItem("userid");
        fetch(`http://localhost:5000/userData`, requestOptions)
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
    };


    useEffect(() => {
        getUser();
    }, []);


    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/signin";
    };

    return (


        <div className="p-2 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

                    <ul className="nav col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                        {MenuData.map((menu, index) => {

                            return (
                                <li key={index}>
                                    <a href={menu.path} className="nav-link text-white px-2 "> <IconContext.Provider value={{ color: "white", size: '30px' }}> {menu.icon}</IconContext.Provider> </a>
                                    <a href={menu.path} className="nav-link text-white px-2">{menu.title}</a>
                                </li>
                            )

                        })}

                    </ul>

                    <form className=" align-items-center col-12 col-lg px-3">
                        <input className="form-control form-control-dark " placeholder="Search..." label="Search" />
                    </form>

                    <a href='/profile' className="nav-link px-3  d-flex justify-content-center text-white">  {userData.fname}  {userData.lname} </a>

                    <div className="">
                        <button type="button" className="btn btn-outline-primary" onClick={logOut}>Sign Out</button>
                    </div>

                </div>
            </div>
        </div >

    )
}