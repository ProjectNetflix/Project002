import Navbar from "./Navbar"
// import './style.css'
import { useState, useffect } from "react"
import PlaylistList from "./PlaylistList";

const Home = () => {

    const [datas, setDatas] = useState([]);
    const [userid, setUserid] = useState('');

    return (
        <div>
            <Navbar />
            <div className="col align-items-center p-3">
            <img
              src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small"
              className="rounded-circle"
              width={100}
              height={100}
            />
            {/* <h4 className=""> {userData.fname} {userData.lname} </h4>
            <span>Follow {following.length} </span>
            <span>Followers {follower.length} </span>
            <span>Playlist {playlist.length}</span>
            <span>Favlist Movie 0</span> */}
            <div>
              <button className="btn btn-outline-warning mt-3" data-bs-toggle="modal" data-bs-target="#EditUser" >Edit Profile</button>
              <PlaylistList />
            </div>


          </div>
        </div>
    )

}

export default Home;


