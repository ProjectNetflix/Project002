import Menu from "../data/Menu";
import { Link } from "react-router-dom"
import { useState } from "react";
import "./Nav.css";

const Nav = () => {


    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => setShowMenu(!showMenu)


    return (
        <div>
            <section class="sidebar">

                <ul class="nav-links">

                {Menu.map((menu, index) => {
                            return (
                                <li className="menu-text" key={index}>
                                    <Link to={menu.path}> {menu.icon} <span>{menu.title}</span></Link>
                                </li>
                            )
                        })}
                </ul>
                
            </section>
        </div>
    )
}
export default Nav;