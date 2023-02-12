import { Link } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import MenuData from "../data/MenuData";
import './style.css'

const Navbar = () => {

    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => setShowMenu(!showMenu)

    return (
        <div>
            <aside>
                <div className="navbar">
                    <div className="navbar-toggle">
                        <Link to="#" className="menu-bar">
                            <FaBars onClick={toggleMenu} />
                        </Link>
                        

                    </div>
                </div>
                <nav className={showMenu ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-item" onClick={toggleMenu}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bar">
                                <FaTimes />
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
            </aside>
        </div>

    )

}
export default Navbar;