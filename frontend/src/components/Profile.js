import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Playlist from "./Playlist";

const Profile = () => {
  const [playlist, setPlaylist] = useState([]);
  const [userData, setUserData] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showpopup, setshowpopup] = useState(false);

  const toggleMenu = (e) => {
    setshowpopup(!e);
    <Playlist />;
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
            <Playlist />
          </div>
        </div>

        <h3 className="align-items-left"> My Playlist Movie </h3>

        <div className="row">
          {playlist.map((item) => {
            return (
              <div className="col" key={item._id}>
                <div className="card h-100">
                  <img
                    src={`http://localhost:5000/${item.imageUrl}`}
                    className="card-img-top w-100 h-100"
                    alt="Playlist Image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.desc}</p>
                  </div>
                  <button className="btn btn-primary m-3 w-50">Edit Playlist</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
