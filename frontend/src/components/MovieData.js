import Navbar from "./Navbar";
import "./MovieData.css";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiTwotoneStar, AiOutlineComment } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
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
    const [state, setState] = useState({
        movie: "",
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
                    console.log(data, "Playlist User");
                    setMovie(data);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาด");
            });
    };

    const GetMovie = async () => {
        console.log(Movieid);

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
                console.log("check", data);
                if (data) {
                    //console.log(data, "Moive");
                    setMoviedata(data);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาด");
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
                    setPost(data);
                    console.log(data);
                } else {
                    alert("Token expired, sign in again");
                }
            });
    };

    const CreatePost = (e) => {
        e.preventDefault();

        if (movie === "" || owner === "" || content === "" || score === "") {
            MySwal.fire({
                text: "Please enter data",
                icon: "warning",
                showConfirmButton: true,
                timer: 5000,
            });
        }
        else if (score < 0 || score > 5) {
            MySwal.fire({
                text: "Please enter score more than 0 or less than 5",
                icon: "warning",
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
                    console.log(data, "Post");

                    if (data) {
                        MySwal.fire({
                            text: "Success",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 3000,
                        });
                        window.location.reload();
                    } else {
                        MySwal.fire({
                            text: "Error",
                            icon: "error",
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    }
                });
        }
    };


    useEffect(() => {
        GetMovie();
        GetPost();
        GetMovies();
    }, []);

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
                        <p><IconContext.Provider value={{ color: "pink", size: "30px" }}>
                            <BsHeart />
                        </IconContext.Provider>
                        </p>
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
                    return (
                        <div className="post ">
                            <div className="card m-2 ">
                                <div className="card-body body-post">
                                    <div className=" post-info m-2 ">
                                        <h5>
                                            <IconContext.Provider
                                                value={{ color: "white", size: "25px" }}
                                            >
                                                <RiAccountPinCircleFill /> <span /> {item.owner.fname}
                                                {item.owner.lname}
                                            </IconContext.Provider>
                                        </h5>
                                        <p>{item.content}</p>
                                        <IconContext.Provider
                                            value={{ color: "yellow", size: "25px" }}
                                        >

                                            <AiTwotoneStar /> {item.score}/5
                                        </IconContext.Provider>
                                    </div>
                                    <div className="post-action d-flexed m-2">
                                        <IconContext.Provider
                                            value={{ color: "red", size: "25px" }}
                                        >

                                            <BsHeart />
                                        </IconContext.Provider>
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
                                            <label>Score</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                value={score}
                                                onChange={inputValue("score")}
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
