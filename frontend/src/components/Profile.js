import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
//import './Navbar.css'
//import './Profile.css'
import Playlist from "./Playlist";

const Profile = () => {

    const [playlist, setPlaylist] = useState([]);
    const [userData, setUserData] = useState({});
    const [showpopup, setshowpopup] = useState(false);

    const toggleMenu = (e) => {
        setshowpopup(!e);
        <Playlist />
    }

    const requestOptions = {
        method: "POST",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            token: window.localStorage.getItem("token"),
            // userId: window.localStorage.getItem("userId"),
        }),
    };

    const getPlaylist = async () => {

        const requestOptions = {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        };
        fetch(`http://localhost:5000/playlists`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    //alert("OK");
                    console.log(data, "Playlist User");
                    setPlaylist(data);
                } else {
                    alert(data.status);
                }
            });

    }

    const getUser = async () => {
        let uid = localStorage.getItem("userid");
        fetch(`http://localhost:5000/userData`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                if (data.data === "token expired") {
                    alert("Token expired signin again");
                    window.localStorage.clear();
                    window.location.href = "./signin";
                } else {
                    setUserData(data.data);
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

            <div className=" container">
                <div className="row-12 ">
                    <div className="col align-items-center p-3">

                        <img src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small" className="rounded-circle " width={100} height={100} />

                        <h4 className="" >{userData.fname} {userData.lname}</h4>
                        <span >Followers {userData.follower} </span>
                        <span >Playlist  4</span>
                        <span >Favlist Movie 0</span>
                        <br />
                        <button className="btn btn-outline-primary m-3">Edit Profile</button>
                        <Playlist />

                    </div>
                </div>

                <h3 className="align-items-left"> My Playlist Movie </h3>

                <div className="row ">

                    {playlist.map((item) => {
                        return (
                            <div className="col">
                                <div className="card h-100">
                                    <img src="https://a.storyblok.com/f/112937/568x464/88ccff84c5/10_most_romantic_cities_hero-1.jpg/m/620x0/filters:quality(70)/" className="card-img-top w-100 h-100" />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-text">{item.desc}</p>
                                    </div>
                                    <button className="btn btn-primary m-3 w-50">Edit Playlist</button>
                                </div>
                            </div>
                        )
                    })}
                </div>


                {/* 
                    <div className="row ">

                        {/* {playlist.map((item) => {
                        <div className="col">
                            <div className="card h-100">
                                <img src="https://a.storyblok.com/f/112937/568x464/88ccff84c5/10_most_romantic_cities_hero-1.jpg/m/620x0/filters:quality(70)/" className="card-img-top w-100 h-100" />

                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text">{item.desc}</p>
                                </div>
                                <button className="btn btn-primary m-3">Edit Playlist</button>
                            </div>
                        </div>
                    })} 

                        <div className="col">
                            <div className="card h-100">
                                <img src="https://a.storyblok.com/f/112937/568x464/88ccff84c5/10_most_romantic_cities_hero-1.jpg/m/620x0/filters:quality(70)/" className="card-img-top w-100 h-100" />

                                <div className="card-body">
                                    <h5 className="card-title">Romantic</h5>
                                    <p className="card-text">คนคูล ๆ อย่างเราต้องดูหนังรักๆ</p>
                                </div>
                                <button className="btn btn-primary m-3">Edit Playlist</button>

                            </div>
                        </div>

                        <div className="col ">

                            <div className="card h-100">
                                <img src="https://www.allkpop.com/upload/2022/01/content/041255/1641318944-cryingactress-cover.png" className="card-img-top w-100 h-100" />
                                <div className="card-body">
                                    <h5 className="card-title">Drama</h5>
                                    <p className="card-text">หนังชีวิต</p>
                                </div>
                                <button className="btn btn-primary m-3">Edit Playlist</button>

                            </div>

                        </div>

                        <div className="col">
                            <div className="card h-100">
                                <img src="https://staticg.sportskeeda.com/editor/2022/01/9441c-16419200856280-1920.jpg" className="card-img-top w-100 h-100" />
                                <div className="card-body">
                                    <h5 className="card-title">Anime</h5>
                                    <p className="card-text"> มาดูอนิเมะด้วยกันสิจ้ะ</p>
                                </div>
                                <button className="btn btn-primary m-3">Edit Playlist</button>

                            </div>
                        </div>

                        <div className="col">
                            <div className="card h-100 ">
                                <img src="https://res.klook.com/image/upload/q_85/c_fill,w_1360/v1641311503/blog/fvuixvhbbjfaas28r2aa.webp" className="card-img-top w-100 h-100" />
                                <div className="card-body">
                                    <h5 className="card-title">K-Series</h5>
                                    <p className="card-text">เป็นติ่งอย่างเราๆ ต้องดูซีรี่ส์เกาหลี</p>
                                </div>
                                <button className="btn btn-primary m-3">Edit Playlist</button>

                            </div>
                        </div>
                    </div>
                 */}

            </div>



        </div>

    );
}
export default Profile;