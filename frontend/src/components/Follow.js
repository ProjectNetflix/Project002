import Navbar from "./Navbar"
import './Follow.css'
import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Follow = () => {

    console.log();
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const location = useLocation();
    const { followid } = location.state;
    const [playlist, setPlaylist] = useState([]);
    const [follow, setFollow] = useState([]);
    const [isFollowed, setIsFollowed] = useState(Boolean);
    // const userId = '...'; // รหัสผู้ใช้ที่ต้องการคัดลอก playlist
    // const playlistId = '...'; // รหัส playlist ที่ต้องการคัดลอก
    // const body = { userid };

    const DefaultPic = "https://xn--72czjvzci0ftdsfvb.com/images/2022/12/22/xn--72czjvzci0ftdsfvb.com_f9cb000afb0aeb014f735bcfd3551282.png";

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
            fetch(`http://localhost:5000/${followid}/unfollow`, requestOptionsPost)  //id user
                .then((response) => response.json())
                .then((res) => {
                    if (res.data) {
                        alert("follow")
                        console.log("บันทึกได้")
                    } else {
                        console.log(res.error)
                    }
                });
            console.log("Unfollow");
            setIsFollowed(false);
            window.location.reload();

        } else {

            fetch(`http://localhost:5000/${followid}/follow`, requestOptionsPost)  //id user
                .then((response) => response.json())
                .then((res) => {
                    if (res.data) {
                        alert("follow")
                        console.log("บันทึกได้")

                    } else {
                        console.log(res.error)
                    }
                });

            console.log("Follow");
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

    const GetFollowData = async () => {

        fetch(`http://localhost:5000/userData/${followid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "follow");
                if (data) {
                    setFollow(data.data);
                    setFollower(data.data.follower);
                    setFollowing(data.data.following);
                    let uid = localStorage.getItem("userId");
                    const checkFollow = data.data.follower.includes(uid);
                    setIsFollowed(checkFollow);
                    console.log("check", isFollowed);

                } else {
                    alert("data not found")
                }
            });

    };

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

        fetch(`http://localhost:5000/playlists-user/${followid}`, requestOptions)
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

    const CopyPlaylists = (e, playlistId) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const ownerplId = followid;
        const body = { userId, ownerplId };

        fetch(`http://localhost:5000/copyPlaylist/${playlistId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    console.log(data); // แสดงผลลัพธ์ที่ได้จาก backend
                    Swal.fire({
                        title: 'Success',
                        text: 'Playlist copied successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    console.error(data); // แสดงข้อผิดพลาด (ถ้ามี)
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to copy playlist.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch((error) => {
                console.error(error); // แสดงข้อผิดพลาด (ถ้ามี)
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while copying the playlist.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    useEffect(() => {
        GetFollowData();
        GetPlaylist();

    }, [followid]);

    return (
        <div>
            <Navbar />
            <div className=" container">

                <div className="row-12 " >
                    <div className="col align-items-center p-3">

                        <img
                            src={follow.imageUrl ? `http://localhost:5000/${follow.imageUrl}` : DefaultPic}
                            className="rounded-circle img-rounded "
                            width={100}
                            height={100}
                        />
                        <h4 >{follow.fname} {follow.lname}</h4>
                        <span >Following {following.length} </span>
                        <span >Followers {follower.length} </span>
                        <span >Playlist  {playlist.length}</span>
                        <span >Favlist Movie 0</span>
                    </div>

                    {isFollowed ? (
                        <button className="btn btn-outline-primary mb-3 " onClick={handleFollowToggle}>Unfollow</button>
                    ) : (
                        <button className="btn btn-primary mb-3 " onClick={handleFollowToggle}>Follow</button>
                    )}

                </div>

                <h5> {follow.fname} {follow.lname}'s Playlist Movie </h5>
                <div className="row card-group">
                    {playlist.map((item) => {
                        return (
                            <div className="col" key={item._id}>
                                <div className="card">

                                    <Link to={{ pathname: `/playlist/${item._id}`, state: { plid: item._id }, }} className="link-no-underline" >

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
                                        <button className="btn btn-outline-primary m-3" onClick={(e) => CopyPlaylists(e, item._id)}>Copy</button>
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


