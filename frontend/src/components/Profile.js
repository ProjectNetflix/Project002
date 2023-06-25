import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PlaylistList from "./PlaylistList";
import EditProfile from "./EditProfile";
import "./Profile.css"
import PostList from "./PostList";

const Profile = () => {
  // const [post, setPost] = useState([]);
  // const [playlist, setPlaylist] = useState([]);
  // const [userData, setUserData] = useState([]);
  // const [follower, setFollower] = useState([]);
  // const [following, setFollowing] = useState([]);
  // const [success, setSuccess] = useState(false);

  // const DefaultPic = "https://xn--72czjvzci0ftdsfvb.com/images/2022/12/22/xn--72czjvzci0ftdsfvb.com_f9cb000afb0aeb014f735bcfd3551282.png";

  // const GetPlaylist = async () => {
  //   const requestOptions = {
  //     method: "GET",
  //     crossDomain: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };

  //   fetch(
  //     `http://localhost:5000/playlists-user/${localStorage.getItem("userId")}`,
  //     requestOptions
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data) {
  //         setPlaylist(data);
  //       } else {
  //         alert(data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       alert("เกิดข้อผิดพลาดในการรับข้อมูล");
  //     });
  // };

  // const GetUser = async () => {
  //   let uid = localStorage.getItem("userId");

  //   const requestOptions = {
  //     method: "GET",
  //     crossDomain: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };

  //   fetch(`http://localhost:5000/userData/${uid}`, requestOptions)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.data === "token expired") {
  //         alert("Token expired, sign in again");
  //         window.localStorage.clear();
  //         window.location.href = "./signin";
  //       } else {
  //         setUserData(data.data);
  //         setFollower(data.data.follower);
  //         setFollowing(data.data.following);
  //       }
  //     });
  // };

  // const GetPost = async () => {
  //   let uid = localStorage.getItem("userId");

  //   const requestOptions = {
  //     method: "GET",
  //     crossDomain: true,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };
  //   fetch(`http://localhost:5000/userPosts/${uid}`, requestOptions)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       //console.log(data);
  //       if (data) {
  //         setPost(data);
  //         console.log(data);
  //       } else {
  //         alert("Token expired, sign in again");
  //       }
  //     });
  // };

  // useEffect(() => {
  //   // GetUser();
  //   // GetPlaylist();
  //   //GetPost();
  // }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <EditProfile />
        <PlaylistList />
        <PostList />
      </div>
    </div >
  );
};

export default Profile;
