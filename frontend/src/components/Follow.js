import Navbar from "./Navbar"
import './Follow.css'
import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const Follow = () => {
    //window.location.reload();

    console.log();
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const location = useLocation();
    const { userid } = location.state;
    const { olduserid } = userid;
    const [playlist, setPlaylist] = useState([]);
    const [follow, setFollow] = useState([]);
    const [isFollowed, setIsFollowed] = useState(Boolean);

    const handleFollowToggle = () => {

        const requestOptionsPost = {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
            , body: JSON.stringify({
                userId: localStorage.getItem("userId"),
            }),
        };

        if (isFollowed) {
            fetch(`http://localhost:5000/${userid}/unfollow`, requestOptionsPost)  //id user
                .then((response) => response.json())
                .then((res) => {
                    if (res.data) {
                        alert("follow")
                        console.log("บันทึกได้")
                    } else {
                        console.log(res.error)
                    }
                });
            MySwal.fire({
                icon: "success",
                text: "UnFollow Success",
                showConfirmButton: false,
                timer: 3000,
            })
            console.log("Unfollow");
            // ตั้งค่าสถานะการติดตามเป็น false
            setIsFollowed(false);
            window.location.reload();

        } else {

            fetch(`http://localhost:5000/${userid}/follow`, requestOptionsPost)  //id user
                .then((response) => response.json())
                .then((res) => {
                    if (res.data) {
                        alert("follow")
                        console.log("บันทึกได้")

                    } else {
                        console.log(res.error)
                    }
                });

            MySwal.fire({
                icon: "success",
                text: "Follow Success",
                showConfirmButton: false,
                timer: 3000,
            })

            console.log("Follow");
            // ตั้งค่าสถานะการติดตามเป็น true
            setIsFollowed(true);
            window.location.reload();

        }

    };

    const requestOptions = {
        method: "GET",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    };

    const getFollowData = async () => {

        fetch(`http://localhost:5000/userData/${userid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "follow");
                if (data) {
                    //alert("Token expired signin again");
                    setFollow(data.data);
                    setFollower(data.data.follower);
                    setFollowing(data.data.following);
                    console.log(data.data.fname)

                    let uid = localStorage.getItem("userId");
                    const checkFollow = data.data.follower.find(e => e == uid);
                    if (checkFollow === "" || checkFollow === undefined) {
                        setIsFollowed(false);
                    }
                    else {
                        setIsFollowed(true);
                    }
                    console.log("check", isFollowed);
                    // window.location.reload();
                } else {
                    alert("data not found")
                }
            });

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

        fetch(`http://localhost:5000/playlists-user/${userid}`, requestOptions)
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

    useEffect(() => {
        getFollowData();
        getPlaylist();

    }, []);

    return (
        <div>
            <Navbar />
            <div className=" container">

                <div className="row-12 " >
                    <div className="col align-items-center p-3">

                        <img src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small" className="rounded-circle " width={100} height={100} />

                        <h4 >{follow.fname} {follow.lname}</h4>
                        <span >Following {following.length} </span>
                        <span >Followers {follower.length} </span>
                        <span >Playlist  {playlist.length}</span>
                        <span >Favlist Movie 0</span>
                    </div>

                    {isFollowed ? (
                        <button className="btn btn-outline-primary mb-3 " onClick={handleFollowToggle}>Unfollow</button>
                    ) : (
                        <button className="btn btn-outline-primary mb-3 " onClick={handleFollowToggle}>Follow</button>
                    )}

                </div>

                <h5> {follow.fname} {follow.lname}'s Playlist Movie </h5>
                <div className="row card-group">
                    {playlist.map((item) => {
                        return (
                            <div className="col" key={item._id}>
                                <div className="card">

                                    <Link to={{ pathname: `/playlist/${item._id}`, state: { title: item.title }, }} className="link-no-underline" >

                                        <div className="card-body text-black">
                                            <img
                                                src={`http://localhost:5000/${item.imageUrl}`}
                                                className="card-img-top playlist-image"
                                                alt="Playlist Image"
                                                style={{ height: '150px' }}

                                            />
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.desc}</p>
                                        </div>
                                        <button className="btn btn-outline-primary m-3">Favorite</button>
                                    </Link>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    )

}

export default Follow;


