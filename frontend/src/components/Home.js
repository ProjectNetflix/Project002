// import Navbar from "./Navbar1"
import Navbar from "./Navbar"
import './style.css'
import { useState, useffect } from "react"
import SearchBar from "./Searchbar1"

const Home = () => {

    const [datas, setDatas] = useState([]);
    const [userid, setUserid] = useState('');

    return (
        <div>
            <Navbar />
            {/* <SearchBar/> */}
        </div>
    )

}

export default Home;


