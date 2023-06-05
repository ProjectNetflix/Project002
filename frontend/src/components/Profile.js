import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PlaylistList from "./PlaylistList";

const Profile = () => {
  const [playlist, setPlaylist] = useState([]);
  const [userData, setUserData] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showpopup, setshowpopup] = useState(false);

  const toggleMenu = (e) => {
    setshowpopup(!e);
    <PlaylistList />;
  };

  const getPlaylist = async () => {
    const requestOptions = {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`http://localhost:5000/playlists-user/${localStorage.getItem("userId")}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data, "Playlist User");
          setPlaylist(data);
        } else {
          alert(data.status);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการรับข้อมูล Playlist");
      });
  };

  const getUser = async () => {
    let uid = localStorage.getItem("userId");
    const requestOptions = {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`http://localhost:5000/userData/${uid}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data === "token expired") {
          alert("Token expired signin again");
          window.localStorage.clear();
          window.location.href = "./signin";
        } else {
          setUserData(data.data);
          setFollower(data.data.follower);
          setFollowing(data.data.following);

        }
      });
  };

  useEffect(() => {
    getUser();
    getPlaylist();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="row-12">
          <div className="col align-items-center p-3">
            <img
              src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small"
              className="rounded-circle"
              width={100}
              height={100}
            />
            <h4 className=""> {userData.fname} {userData.lname} </h4>
            <span>Follow {following.length} </span>
            <span>Followers {follower.length} </span>
            <span>Playlist {playlist.length}</span>
            <span>Favlist Movie 0</span>
            <br />
            <button className="btn btn-outline-primary m-3">Edit Profile</button>
            <PlaylistList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
