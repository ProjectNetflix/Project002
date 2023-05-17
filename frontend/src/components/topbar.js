import "./topbar.css";
import { AiOutlineBars, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BsFillPersonFill, BsFillChatDotsFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
// import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import MenuData from "../data/MenuData";
import './style.css'

export default function Topbar() {

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
                    alert("Token expired sign in again");
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
        <div >

            <div className="topbarContainer">
                <div className="topbarLeft">
                    <nav className={showMenu ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-item" onClick={toggleMenu}>
                            <li className="navbar-toggle">
                                <Link to="#" className="menu-bar">
                                    <AiOutlineBars />
                                </Link>
                            </li>
                            {MenuData.map((menu, index) => {
                                return (
                                    <li className="menu-text" key={index}>
                                        <Link to={menu.path}> {menu.icon} <span>{menu.title}</span></Link>
                                    </li>
                                )
                            })}

                        </ul>
                    </nav>

                    <Link to="#" className="menu-bar">
                        <AiOutlineBars onClick={toggleMenu} />
                    </Link>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span className="logo">JM Blog Master</span>
                    </Link>


                </div>
                <div className="topbarCenter">
                    <div className="searchbar">
                        <AiOutlineSearch className="searchIcon" />
                        <input
                            placeholder="Search"
                            className="searchInput"
                        />
                    </div>
                </div>

                <button type="submit" onClick={logOut} className="btn btn-primary">Log out</button>

                <div className="topbarRight">

                    <div className="topbarLinks">
                        <span className="topbarLink">{userData.fname}</span>
                    </div>

                    <div className="topbarIcons">
                        <div className="topbarIconItem">
                            <BsFillPersonFill />
                            <span className="topbarIconBadge">1</span>
                        </div>

                        <div className="topbarIconItem">
                            <BsFillChatDotsFill />
                            <span className="topbarIconBadge">2</span>
                        </div>

                        <div className="topbarIconItem">
                            <IoIosNotificationsOutline />
                            <span className="topbarIconBadge">1</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>


    );
}