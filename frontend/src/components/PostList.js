import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IconContext } from "react-icons";
import { AiTwotoneStar } from "react-icons/ai";
import { MdRateReview } from "react-icons/md";
import { BiDislike, BiLike } from "react-icons/bi";
import { MdOutlineFeaturedPlayList, MdReviews } from "react-icons/md";
const MySwal = withReactContent(Swal);

const PostList = () => {
  const [movielist, setMovie] = useState([]);
  const [allpost, setAllPost] = useState([]);
  const [postId, setPostId] = useState();
  const [post, setPost] = useState([]);

  const [state, setState] = useState({
    movie: "",
    content: "",
    owner: localStorage.getItem("userId"),
    score: "",
  });

  const { movie, content, owner, score } = state;

  const CurrentPost = (e, postid) => {
    setPostId(postid);
    const selectedPost = allpost.find((item) => item._id === postid);
    console.log("select", selectedPost);
    setState({
      ...state,
      movie: selectedPost.movie,
      content: selectedPost.content,
      score: selectedPost.score,
    });
    console.log(state);
  };

  const inputValue = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

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
    fetch(`http://localhost:5000/allpost`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAllPost(data);
          console.log("allpost", data);
        } else {
          //alert("Token expired, sign in again");
        }
      });
  };

  const GetPostUser = async () => {
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

  const EditPost = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content, score }),
    };

    fetch(`http://localhost:5000/editPost/${postId}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          MySwal.fire({
            text: "Post updated successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

  const DeletePost = (postId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        fetch(`http://localhost:5000/deletePost/${postId}`, requestOptions)
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              MySwal.fire({
                text: "Post deleted successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              });
              window.location.reload();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    GetAllPost();
    GetMovies();
    GetPostUser();
  }, []);

  return (
    <div>
      <div className="container">
        <br />
        <h4>
          <IconContext.Provider value={{ color: "orange", size: "35px" }}>
            <MdReviews /> <span /> MY POST
          </IconContext.Provider>
        </h4>
        <br />
        {post.map((item) => {
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
                      <button className="btn btn-outline-warning m-2 " data-bs-toggle="modal" data-bs-target="#EditPost"
                        onClick={(e) => CurrentPost(e, item._id)} > Edit
                      </button>
                      <button className="btn btn-outline-danger m-2" onClick={() => DeletePost(item._id)} > Delete </button>
                    </div>

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

      <div
        className="modal fade"
        id="EditPost"
        tabIndex="-1"
        aria-labelledby="UserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="UserModalLabel">
                Edit Post Review
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

                    <select className="custom-select" value={movie} onChange={inputValue("movie")} disabled={true}>
                      <option value="">Choose</option>
                      {movielist.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
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
                onClick={(e) => EditPost(e, postId)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostList;
