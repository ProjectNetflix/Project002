import Navbar from "./Navbar"
import Topbar from "./topbar"
import './style.css'
import { useState, useffect } from "react"

const User = () => {

    const data = [
        { id: 1, name: "narudee", gender: "femel" }
    ]
    const [user, setUser] = useState(data)

    return (
        <div>
            <Topbar />
            <div className="profile">
                <h2>Profile</h2>
                <div className="card-body">
                    {/* <ul>
                    {user.map((item, index) => {
                        return (
                            <label>Gender <span> {item.gender}</span></label>
                        )
                    })}
                </ul> */}
                </div>
            </div >
        </div>

    )

}

export default User;


