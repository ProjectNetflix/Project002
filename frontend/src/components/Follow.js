import Navbar from "./NavbarFollow"
import './Follow.css'
import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { BsHeartFill, BsPlusCircle, BsHeart } from "react-icons/bs";
import { IconContext } from "react-icons";
import { RiPlayList2Line } from "react-icons/ri";
import { AiTwotoneStar } from "react-icons/ai";
import { MdRateReview, MdReviews } from "react-icons/md";

const Follow = () => {

    const MySwal = withReactContent(Swal)

    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const location = useLocation();
    const { followid } = location.state;
    const [playlist, setPlaylist] = useState([]);
    const [follow, setFollow] = useState([]);
    const [isFollowed, setIsFollowed] = useState(Boolean);
    const [post, setPost] = useState([]);

    // const userId = '...'; // รหัสผู้ใช้ที่ต้องการคัดลอก playlist
    // const playlistId = '...'; // รหัส playlist ที่ต้องการคัดลอก
    // const body = { userid };

    const DefaultPic = "https://xn--72czjvzci0ftdsfvb.com/images/2022/12/22/xn--72czjvzci0ftdsfvb.com_f9cb000afb0aeb014f735bcfd3551282.png";
    const DefaultPic1 = "https://cdn.icon-icons.com/icons2/2632/PNG/512/movies_icon_159164.png";

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
                        // console.log("บันทึกได้")
                    } else {
                        // console.log(res.error)
                    }
                });
            // console.log("Unfollow");
            setIsFollowed(false);
            window.location.reload();

        } else {

            fetch(`http://localhost:5000/${followid}/follow`, requestOptionsPost)  //id user
                .then((response) => response.json())
                .then((res) => {
                    if (res.data) {
                        alert("follow")
                        // console.log("บันทึกได้")

                    } else {
                        // console.log(res.error)
                    }
                });

            // console.log("Follow");
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
                // console.log(data, "follow");
                if (data) {
                    setFollow(data.data);
                    setFollower(data.data.follower);
                    setFollowing(data.data.following);
                    let uid = localStorage.getItem("userId");
                    const checkFollow = data.data.follower.includes(uid);
                    setIsFollowed(checkFollow);
                    // console.log("check", isFollowed);

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
                    // console.log(data, "Playlist User");
                    setPlaylist(data);
                } else {
                    alert(data.status);
                }
            })
            .catch((error) => {
                // console.error(error);
                alert("playlist error");
            });
    };

    const CopyPlaylists = (e, playlistId, originalOwner) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const ownerplId = followid;
        const body = { userId, ownerplId, playlistId, originalOwner };

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
                    // console.log(data); // แสดงผลลัพธ์ที่ได้จาก backend
                    Swal.fire({
                        title: 'Success',
                        text: 'Playlist add successfully!',
                        // icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    // console.error(data); // แสดงข้อผิดพลาด (ถ้ามี)
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to add to my playlist.',
                        // icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch((error) => {
                // console.error(error); // แสดงข้อผิดพลาด (ถ้ามี)
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while adding the playlist.',
                    // icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const GetPostFollow = async () => {

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
        fetch(`http://localhost:5000/userPosts/${followid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                //console.log(data);
                if (data) {
                    setPost(data);
                    // console.log(data);
                } else {
                    alert("Token expired, sign in again");
                }
            });
    };

    const handleLike = async (postId) => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                const updatedPosts = post.map((post) => {
                    if (post._id === updatedPost._id) {
                        return updatedPost;
                    }
                    return post;
                });
                setPost(updatedPosts);
            } else {
                // console.error("Failed to update post");
            }
            GetPostFollow();
        } catch (error) {
            // console.error("Error:", error);
        }
    };

    useEffect(() => {
        GetFollowData();
        GetPlaylist();
        GetPostFollow();
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
                        <h4 className="m-2">{follow.fname} {follow.lname}</h4>
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

                <br />
                <h4><IconContext.Provider value={{ color: "green", size: "35px" }}>
                    <RiPlayList2Line /> <span> </span> {follow.fname} {follow.lname}'s MOVIE PLAYLIST 
                </IconContext.Provider></h4>
                <br />

                <div className="row card-group">
                    {playlist.map((item) => {

                        return (

                            <div className="col" key={item._id}>
                                <div className="card">

                                    <Link to={{ pathname: `/playlist/${item._id}`, state: { plid: item._id }, }} className="link-no-underline" >

                                        <div className="card-body text-black">
                                            <img
                                                src={item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : DefaultPic1}
                                                className="card-img-top playlist-image"
                                                alt="Playlist Image"
                                                style={{ height: '150px' }}

                                            />
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.desc}</p>
                                        </div>
                                        <button className="btn btn-outline-primary m-3" onClick={(e) => CopyPlaylists(e, item._id, item.originalOwner)}><p className="h6">Add To <br/>My Movie Playlists</p></button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="container">
                <br />
                <h4>
                    <IconContext.Provider value={{ color: "orange", size: "35px" }}>
                        <MdReviews /> <span />{follow.fname} {follow.lname}'s POST
                    </IconContext.Provider>
                </h4>
                <br />
                {post.map((item) => {
                    const isLiked = item.likes.includes(localStorage.getItem("userId"));
                    const likeCount = item.likes.length;
                    return (
                        <div className="post" key={item._id}>
                            <div className="card m-2 ">
                                <div className="card-body d-flex">
                                    <div className=" img-post">
                                        <img src={item.movie.pic} alt="Movie Image" style={{ height: "200px" }} />
                                    </div>

                                    <div className=" post-info m-2 ">
                                        <h4>{item.movie.name}</h4>
                                        <p>{item.content}</p>
                                        <IconContext.Provider value={{ color: "yellow", size: "25px" }}> <AiTwotoneStar /> {item.score}/5</IconContext.Provider>

                                        <div className="post-action d-flex justify-content-center ">
                                            <div className="m-2" onClick={() => handleLike(item._id)}>
                                                <IconContext.Provider value={{ color: isLiked ? "red" : "black", size: "20px" }}>
                                                    <BsHeartFill /> <span /> {likeCount} <span /> Like
                                                </IconContext.Provider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div >
    )

}

export default Follow;


