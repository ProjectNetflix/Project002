// import Navbar from "./Navbar1"
import Navbar from "./Navbar"
import './style.css'
import { useState, useEffect } from "react"
import axios from 'axios';


const Follow = () => {


    const [userData, setUserData] = useState({});
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
  
    const [follow, setFollow] = useState({});
    const [userId, setUserId] = useState(""); // id user login
    
    const [users, setUsers] = useState([]);

    const [word, setWord] = useState("")
    const [dataFilter] = useState(["lname", "fname", "fname lname"])
    const [rearch, setRearch] = useState([]);

    const searchFollow = (rearch) => {
        return rearch.filter((item) => {
            return dataFilter.some((filter) => {
                if (item[filter]) {//check ค่าว่าง
                    //console.log(item[filter]);
                    return item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
                }
            })
        })
    }

    const handleChange = (e) => {
        e.preventDefault();
        setWord(e.target.value);
    };

    const convertType = (data) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };
   
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

    const getUser = async () => {

        const requestOptions = {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };

        fetch(`http://localhost:5000/allusers`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                if (data.status === "ok") {
                    console.log(data.data)
                    setRearch(data.data);
                } else {
                    alert("Token expired signin again");
                }
            });
    };

    const getUserData = async () => {
        let uid = localStorage.getItem("userId");
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
                    setUserId(uid);
                    console.log(uid);
                }
            });
    };

    useEffect(() => {
        getUserData();
        getUser();
    }, []);

    

    useEffect(() => {
        const fetchFollowers = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/find/${userId}`);
            setFollowers(response.data.follower);
            setFollowing(response.data.following);
            console.log("res data",response.data)
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchFollowers();
    }, [userId]);

    const handleFollow = (userId) => {
        // ส่งคำขอติดตามผ่าน API
        axios
          .put(`http://localhost:5000/${userId}/follow`)
          .then((response) => {
            // อัปเดตข้อมูล User ที่ติดตามแล้ว
            const updatedUsers = users.map((user) => {
              if (user._id === userId) {
                return { ...user, isFollowing: true };
              }
              return user;
            });
            setUsers(updatedUsers);
          })
          .catch((error) => console.error(error));
      };
    
      const handleUnfollow = (userId) => {
        // ส่งคำขอยกเลิกติดตามผ่าน API
        axios
          .put(`http://localhost:5000/${userId}/unfollow`)
          .then((response) => {
            // อัปเดตข้อมูล User ที่ยกเลิกติดตาม
            const updatedUsers = users.map((user) => {
              if (user._id === userId) {
                return { ...user, isFollowing: false };
              }
              return user;
            });
            setUsers(updatedUsers);
          })
          .catch((error) => console.error(error));
      };

    function submit() {

        console.log(userId)

        const requestOptionsPost = {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
            , body: JSON.stringify({
                userId,
            }),
        };

        fetch("http://localhost:5000/646a04e953b89b2dddd928db/follow", requestOptionsPost)  //id user
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    alert("follow")
                    console.log("บันทึกได้")


                } else {
                    console.log(res.error)

                }
            });
    }

    return (
        <div>
            <Navbar />
            <div className=" container">

                    {users.map((user) => (
                        <div key={user._id}>
                        <img src={user.profilePicture} alt="Profile" />
                        <h4>{user.fullName}</h4>
                        <span>Followers: {user.followers.length}</span>
                        <span>Following: {user.following.length}</span>

                        {user.isFollowing ? (
                            <button onClick={() => handleUnfollow(user._id)}>Unfollow</button>
                        ) : (
                            <button onClick={() => handleFollow(user._id)}>Follow</button>
                        )}
                        </div>
                    ))}

                <div className="row-12 ">
                    <div className="col align-items-center p-3">

                        <img src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small" className="rounded-circle " width={100} height={100} />

                        <h4 className="" >{userId.fname} {userId.lname}</h4>
                        <span >Followers {followers.length} </span>
                        <span >Following {following.length} </span>
                        {/* <span >Playlist  4</span>
                        <span >Favlist Movie 0</span>
                        <span >uid {userData._id}</span> */}
                        {/* <UserTable users={users} onFollow={handleFollow} onUnfollow={handleUnfollow} />                      */}

                        <button className="btn btn-outline-primary m-3 " onClick={submit}>Follow</button>

                    </div>
                </div>

<<<<<<< HEAD
=======
               

>>>>>>> fc2c22d33cdbe5e906eba25090e20f4f4bd32914
                <h3 className="align-items-left"> My Playlist Movie </h3>
                <div className="row ">

                    <div className="col">
                        <div className="card h-100">
                            <img src="https://a.storyblok.com/f/112937/568x464/88ccff84c5/10_most_romantic_cities_hero-1.jpg/m/620x0/filters:quality(70)/" className="card-img-top w-100 h-100" />
                            <div className="card-body">
                                <h5 className="card-title">Romantic</h5>
                                <p className="card-text">คนคูล ๆ อย่างเราต้องดูหนังรักๆ</p>
                                {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                            </div>
                            <button className="btn btn-primary m-3">Fav List</button>

                        </div>
                    </div>

                    <div className="col ">

                        <div className="card h-100">
                            <img src="https://www.allkpop.com/upload/2022/01/content/041255/1641318944-cryingactress-cover.png" className="card-img-top w-100 h-100" />
                            <div className="card-body">
                                <h5 className="card-title">Drama</h5>
                                <p className="card-text">หนังชีวิต</p>
                                {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                            </div>
                            <button className="btn btn-primary m-3">Fav List</button>

                        </div>

                    </div>

                    <div className="col">
                        <div className="card h-100">
                            <img src="https://staticg.sportskeeda.com/editor/2022/01/9441c-16419200856280-1920.jpg" className="card-img-top w-100 h-100" />
                            <div className="card-body">
                                <h5 className="card-title">Anime</h5>
                                <p className="card-text"> มาดูอนิเมะด้วยกันสิจ้ะ</p>
                                {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                            </div>
                            <button className="btn btn-primary m-3">Fav List</button>

                        </div>
                    </div>

                    <div className="col">
                        <div className="card h-100 ">
                            <img src="https://res.klook.com/image/upload/q_85/c_fill,w_1360/v1641311503/blog/fvuixvhbbjfaas28r2aa.webp" className="card-img-top w-100 h-100" />
                            <div className="card-body">
                                <h5 className="card-title">K-Series</h5>
                                <p className="card-text">เป็นติ่งอย่างเราๆ ต้องดูซีรี่ส์เกาหลี</p>
                                {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                            </div>
                            <button className="btn btn-primary m-3">Fav List</button>

                        </div>
                    </div>

                </div>
            </div>

        </div >
    )

}

export default Follow;


