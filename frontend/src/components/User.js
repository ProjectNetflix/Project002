import Navbar from "./Navbar"
import './style.css'
import { useState, useffect } from "react"
const User = () => {



    const data = [
        { id: 1, name: "narudee", gender: "femel" }

    ]
    const [user, setUser] = useState(data)

    return (


        <div className="user-container">
            <Navbar />
            <br />
            {/* <h1> Joy Chic </h1> */}
            <h2>ข้อมูลส่วนตัว</h2>
            <div className="user-data-container">



                <ul>
                    {user.map((item, index) => {
                        return (
                            <label>Gender <span> {item.gender}</span></label>
                        )
                    })}
                </ul>

            </div>



        </div >
    )

}

export default User;


