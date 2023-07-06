import Navbar from "./NavbarFollow";
import "./MovieData.css";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiTwotoneStar, AiOutlineComment, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { MdRateReview } from "react-icons/md";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MovieData = () => {

    const MySwal = withReactContent(Swal);
    const location = useLocation();
    const { Movieid } = location.state;
    const [Moviedata, setMoviedata] = useState([]);
    const [movielist, setMovie] = useState([]);
    const [userData, setUserData] = useState([]);
    const [success, setSuccess] = useState(Boolean);
    const [isLiked, setisLiked] = useState(Boolean);
    const [avgscore, setAvgscore] = useState();

    const [state, setState] = useState({
        movie: Movieid,
        content: "",
        owner: localStorage.getItem("userId"),
        score: "",
    });

    const { movie, content, owner, score } = state;

    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const GetMovies = async () => {
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
        fetch(`http://localhost:5000/movies`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    //console.log(data, "Playlist User");
                    setMovie(data);
                }
            })
            .catch((error) => {
                // console.error(error);
                alert("failed to get movie data");
            });
    };

    const GetMovie = async () => {
        //console.log(Movieid);

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
        fetch(`http://localhost:5000/movie/${Movieid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                //console.log("check", data);
                if (data) {
                    //console.log(data, "Moive");
                    setMoviedata(data);
                }
            })
            .catch((error) => {
                // console.error(error);
                alert("error");
            });
    };

    const [post, setPost] = useState([]);
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
        fetch(`http://localhost:5000/postsmovie/${Movieid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    if (data === "" || data === null || data.length === 0) {
                        setAvgscore(Number(0));
                    } else {
                        setPost(data);
                        // console.log(data);
                        const scores = data.map((post) => Number(post.score));
                        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                        setAvgscore(averageScore.toFixed(2));
                        // console.log("Average Score:", averageScore.toFixed(2));
                    }

                } else {
                    alert("Token expired, sign in again");
                }
            });
    };

    const CreatePost = (e) => {
        e.preventDefault();
        // console.log(state);
        if (movie === "" || owner === "" || content === "" || score === "") {
            MySwal.fire({
                text: "Please enter data",
                // icon: "warning",
                showConfirmButton: true,
                timer: 5000,
            });
        }
        else if (score < 0 || score > 5) {
            MySwal.fire({
                text: "Please enter score more than 0 or less than 5",
                // icon: "warning",
                showConfirmButton: true,
                timer: 5000,
            });
        }
        else {
            fetch("http://localhost:5000/createPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    content: content,
                    movieId: movie,
                    userId: owner,
                    score: score,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data, "Post");

                    if (data) {
                        MySwal.fire({
                            text: "Success",
                            // icon: "success",
                            showConfirmButton: false,
                            timer: 3000,
                        });
                        window.location.reload();
                    } else {
                        MySwal.fire({
                            text: "Error",
                            // icon: "error",
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    }
                });
        }
    };

    const handleLikeToggle = (movieId, action) => {
        // โค้ดการส่งคำขอ PUT ไปยังเซิร์ฟเวอร์เพื่อกด like หรือ unlike หนัง
        //const Action = action;
        //const action = like[movieId] ? "unlike" : "like";
        const userId = localStorage.getItem("userId"); // รหัสผู้ใช้

        // console.log(action, movieId);
        fetch(`http://localhost:5000/users/${userId}/movies/${movieId}/${action}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action }),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("new", data);
                setSuccess(true);
            })
            .catch((error) => {
                // console.error(error);
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
                    //console.log("jj", data.data);
                    setUserData(data.data);
                    const Liked = data.data.likesMovies.includes(Movieid);
                    setisLiked(Liked);
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
                // setAllPost(updatedPosts);
            } else {
                // console.error("Failed to update post");
            }
            setSuccess(true);
            //GetAllPost();
        } catch (error) {
            // console.error("Error:", error);
        }
    };

    useEffect(() => {
        GetUser();
        GetMovie();
        GetPost();
        GetMovies();
        setSuccess(false);
    }, [success]);

    return (

        <div>
            <Navbar />
            <div className="container">
                <div className=" movie mr-3 mt-5">
                    <div className="img-movie ">
                        <img
                            src={Moviedata.pic}
                            alt="Movie Image"
                            style={{ height: "250px" }}
                        />
                    </div>

                    <div className="movie-info mt-2">
                        <h4>{Moviedata.name}</h4>
                        <p>{Moviedata.synopsis}</p>
                        <div>
                            {isLiked ? (
                                <button type="button" className="btn" onClick={() => handleLikeToggle(Movieid, "unlike")}>
                                    <IconContext.Provider value={{ color: "red", size: "25px" }}>
                                        <BsHeartFill />
                                    </IconContext.Provider>
                                </button>) : (
                                <button type="button" className="btn" onClick={() => handleLikeToggle(Movieid, "like")}>
                                    <IconContext.Provider value={{ size: "25px" }}>
                                        <BsHeart />
                                    </IconContext.Provider>
                                </button>)}


                        </div>

                        <div className="m-2">
                            <IconContext.Provider
                                value={{ color: "yellow", size: "25px" }}
                            >

                                <AiTwotoneStar /> Average Score: {avgscore}/5
                            </IconContext.Provider>
                            <span />
                            <IconContext.Provider
                                value={{ color: "black", size: "25px" }}
                            >
                                <RiAccountPinCircleFill /> Number of user reviews: {post.length}
                            </IconContext.Provider>
                        </div>

                        <button className="btn btn-outline-danger m-3" data-bs-toggle="modal" data-bs-target="#CreatePost">
                            Review
                        </button>
                    </div>

                </div>
            </div>

            <div className="container">
                <br />
                <br />
                <h4>
                    <IconContext.Provider value={{ color: "purple", size: "35px" }}>
                        <AiOutlineComment /> <span /> REVIEW
                    </IconContext.Provider>
                </h4>
                <br />

                {post.map((item) => {

                    const isLiked = item.likes.includes(localStorage.getItem("userId"));
                    const likeCount = item.likes.length;

                    return (
                        <div className="post " key={item._id}>
                            <div className="card m-2 ">
                                <div className="card-body body-post">
                                    <div className=" post-info m-2 ">
                                        <h5>
                                            <IconContext.Provider
                                                value={{ color: "white", size: "25px" }}
                                            >
                                                <RiAccountPinCircleFill /> <span /> {item.owner.fname} {item.owner.lname}
                                            </IconContext.Provider>
                                        </h5>
                                        <p>{item.content}</p>
                                        <IconContext.Provider
                                            value={{ color: "yellow", size: "25px" }}
                                        >

                                            <AiTwotoneStar /> {item.score}/5
                                        </IconContext.Provider>
                                    </div>

                                    <div className="post-action d-flexed m-2" onClick={() => handleLike(item._id)}>
                                        {isLiked ? (<IconContext.Provider value={{ color: "blue", size: "20px" }}>
                                            <AiFillLike /> <span /> {likeCount} <span /> Like
                                        </IconContext.Provider>) : (<IconContext.Provider value={{ size: "20px" }}>
                                            <AiFillLike /> <span /> {likeCount} <span /> Like
                                        </IconContext.Provider>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <div
                    className="modal fade"
                    id="CreatePost"
                    tabIndex="-1"
                    aria-labelledby="UserModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="UserModalLabel">
                                    <IconContext.Provider value={{ color: "red", size: "35px" }}>
                                        <MdRateReview /> Post Review
                                    </IconContext.Provider>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form className="container w-100 h-50">
                                    <div className="form-content ">
                                        <div className="form-group mt-2">
                                            <label>Moive</label>
                                            <select
                                                className="custom-select"
                                                value={Moviedata._id}
                                                onChange={inputValue("movie")}
                                                disabled={true}
                                            >
                                                <option> {Moviedata.name} </option>
                                            </select>
                                        </div>

                                        <div className="form-group mt-2">
                                            <label>Content</label>
                                            <textarea
                                                type="text"
                                                className="form-control mt-1"
                                                value={content}
                                                onChange={inputValue("content")}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label>Score (0 - 5)</label>
                                            <input
                                                type="number"
                                                className="form-control mt-1"
                                                value={score}
                                                onChange={inputValue("score")}
                                                min={0}
                                                max={5}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={CreatePost}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MovieData;
