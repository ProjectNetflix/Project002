import Navbar from "./Navbar"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiTwotoneStar, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { CgFeed } from "react-icons/cg";
import { MdRateReview } from "react-icons/md";
import { BsHeartFill, BsPlusCircle, BsHeart } from "react-icons/bs";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Home = () => {

  const MySwal = withReactContent(Swal)
  const [allpost, setAllPost] = useState([]);
  const [post, setPost] = useState([]);
  const [movielist, setMovie] = useState([]);
  const [postId, setPostId] = useState();
  const [success, setSuccess] = useState(Boolean);
  const [selectedMovie, setSelectedMovie] = useState();
  const defaultpic = "https://icon-library.com/images/free-movies-icon/free-movies-icon-16.jpg";
  const [state, setState] = useState({
    movie: "",
    content: "",
    owner: localStorage.getItem("userId"),
    score: "",
  });

  const inputValue = (name) => (event) => {
    if (name === "movie") {
      const selectedMovie = movielist.find((item) => item._id === event.target.value);
      setSelectedMovie(selectedMovie);
    }
    setState({ ...state, [name]: event.target.value });
  };

  const { movie, content, owner, score } = state;
  const GetAllPost = async () => {
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
    fetch(`http://localhost:5000/allpost/following/${localStorage.getItem("userId")}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAllPost(data);
          // console.log("allpost", data);
        } else {
          //alert("Token expired, sign in again");
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
        const updatedPosts = allpost.map((post) => {
          if (post._id === updatedPost._id) {
            return updatedPost;
          }
          return post;
        });
        setAllPost(updatedPosts);
      } else {
        // console.error("Failed to update post");
      }
      setSuccess(true);
      //GetAllPost();
    } catch (error) {
      // console.error("Error:", error);
    }
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
        alert("error");
      });
  };

  const CreatePost = (e) => {
    e.preventDefault();

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
          if (data) {
            MySwal.fire({
              text: "Success",
              // icon: "success",
              showConfirmButton: true,
              timer: 3000,
            });
            //window.location.reload();
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

  useEffect(() => {
    GetAllPost();
    setSuccess(false);
    GetMovies();

  }, [success]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <br />
        <h3> <IconContext.Provider value={{ color: "blue", size: "50px" }}> <CgFeed /> <span /> Feed</IconContext.Provider></h3>
        <br />

        <button className="btn btn-danger m-3" data-bs-toggle="modal" data-bs-target="#CreatePost">
          Post Review
        </button>

        <div>
          <div
            className="modal fade"
            id="CreatePost"
            tabIndex="-1"
            aria-labelledby="PostModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="PostModalLabel">
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
                  <form className="container">
                    <div className="form-content ">
                      <div className="form-group mt-2">
                        <label>Moive</label>
                        <select
                          className="custom-select"
                          onChange={inputValue("movie")}
                        >
                          <option value="">Choose</option>
                          {movielist.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
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

        {allpost.map((item) => {

          const isLiked = item.likes.includes(localStorage.getItem("userId"));
          const likeCount = item.likes.length;

          return (
            <div className="post" key={item._id}>
              <div className="card m-2 ">
                <div className="card-body d-flex">

                  <Link
                    to={{
                      pathname: `/movies/${item.movie._id}`,
                      state: { Movieid: item.movie._id },
                    }}
                    className="link-no-underline"
                  >
                    <div className="img-post">
                      <img src={item.movie.pic} alt="Movie Image" style={{ height: "200px" }} />
                    </div>
                  </Link>

                  <div className=" post-info m-2 ">
                    <h5>{item.owner.fname} {item.owner.lname}</h5>
                    <h6>{item.movie.name}</h6>
                    <p>{item.content}</p>
                    <IconContext.Provider value={{ color: "yellow", size: "25px" }}> <AiTwotoneStar /> {item.score}/5</IconContext.Provider>
                    <div className="post-action d-flex justify-content-center m-2 ">

                      <div className="m-2" onClick={() => handleLike(item._id)}>
                        {isLiked ? (<IconContext.Provider value={{ color: "blue", size: "20px" }}>
                          <AiFillLike /> <span /> {likeCount} <span /> Like
                        </IconContext.Provider>) : (<IconContext.Provider value={{ size: "20px" }}>
                          <AiFillLike /> <span /> {likeCount} <span /> Like
                        </IconContext.Provider>)}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )

}

export default Home;


