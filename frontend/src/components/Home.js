import Navbar from "./Navbar"
import './style.css'
import { useState, useffect } from "react"

const Home = () => {

    const [datas, setDatas] = useState([]);
    const [userid, setUserid] = useState('');

    return (
        <div>
            <Navbar />
        </div>
    )

}

export default Home;


