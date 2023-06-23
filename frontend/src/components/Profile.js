import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PlaylistList from "./PlaylistList";
import EditProfile from "./EditProfile";
import "./Profile.css"
import PostList from "./PostList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";



const Profile = () => {
  const MySwal = withReactContent(Swal);
  const [post, setPost] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [userData, setUserData] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const DefaultPic = "https://xn--72czjvzci0ftdsfvb.com/images/2022/12/22/xn--72czjvzci0ftdsfvb.com_f9cb000afb0aeb014f735bcfd3551282.png";

  const GetPlaylist = async () => {
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

    fetch(
      `http://localhost:5000/playlists-user/${localStorage.getItem("userId")}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPlaylist(data);
        } else {
          alert(data.status);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการรับข้อมูล");
      });
  };

  const GetUser = async () => {
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
        if (data.data === "token expired") {
          alert("Token expired, sign in again");
          window.localStorage.clear();
          window.location.href = "./signin";
        } else {
          setUserData(data.data);
          setFollower(data.data.follower);
          setFollowing(data.data.following);
        }
      });
  };

  const GetPost = async () => {
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
    fetch(`http://localhost:5000/userPosts/${uid}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (data) {
          setPost(data);
          console.log(data);
        } else {
          alert("Token expired, sign in again");
        }
      });
  };

  useEffect(() => {
    GetUser();
    GetPlaylist();
    //GetPost();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">

        <div className="user">
          <div className="img-user col ">
            <div className="info card-body">
              <img
                src={userData.imageUrl ? `http://localhost:5000/${userData.imageUrl}` : DefaultPic}
                className="rounded-circle img-rounded "
                width={100}
                height={100}
              />

              <div className="info-text">
                <h4 className="p-2"> {userData.fname} {userData.lname}</h4>
                <span >Following {following.length} </span>
                <span >Followers {follower.length} </span>
                <span >Playlist  {playlist.length}</span>
                <span >Favlist Movie 0</span>
              </div>
            </div>
            <button className="btn btn-outline-warning m-3" data-bs-toggle="modal" data-bs-target="#EditUser">
              Edit Profile
            </button>
            <button className="btn btn-outline-info m-3" data-bs-toggle="modal" data-bs-target="#CreatePlaylist">
              Create Playlist
            </button>
            <button className="btn btn-outline-danger m-3" data-bs-toggle="modal" data-bs-target="#CreatePost">
              Post Review
            </button>

          </div>
        </div>

        <EditProfile />
        <PlaylistList />
        <PostList />
        
      </div>
    </div >
  );
};

export default Profile;
