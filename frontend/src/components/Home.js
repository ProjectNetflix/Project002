// import Navbar from "./Navbar1"
import Navbar from "./Navbar"
import './style.css'
import { useState, useffect } from "react"
import searchBar from "./Searchbar"

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


