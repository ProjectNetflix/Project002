import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IconContext } from "react-icons";
import { AiTwotoneStar } from "react-icons/ai";
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
    rating: "",
  });

  const { movie, content, owner, rating } = state;

  const CurrentPost = (e, postid) => {
    setPostId(postid);
    const selectedPost = allpost.find((item) => item._id === postid);
    console.log("select",selectedPost);
    setState({
      ...state,
      movie: selectedPost.movie,
      content: selectedPost.content,
      rating: selectedPost.rating,
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
      body: JSON.stringify({ content, rating }),
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

    if (movie === "" || owner === "" || content === "" || rating === "") {
      MySwal.fire({
        text: "Please enter data",
        icon: "warning",
        showConfirmButton: true,
        timer: 5000,
      });
    } else {
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
          rating: rating,
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
    GetAllPost();
    GetMovies();
    GetPostUser();
  }, []);

  return (
    <div>
      <div className="container">
        <h5>MY POST</h5>
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
                    <IconContext.Provider value={{ color: "yellow", size: "25px" }}> <AiTwotoneStar /> {item.rating}/5</IconContext.Provider>
                  </div>
                </div>

                <div className="post-action d-flex justify-content-end ">
                  <button className="btn btn-outline-warning m-3 " data-bs-toggle="modal" data-bs-target="#EditPost"
                    onClick={(e) => CurrentPost(e, item._id)} > Edit
                  </button>
                  <button className="btn btn-outline-danger m-3"> Delete </button>
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
                  Post Review
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
                      <label>Rating</label>
                      <input
                        type="text"
                        className="form-control mt-1"
                        value={rating}
                        onChange={inputValue("rating")}
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

                    <select className="custom-select" value={movie} onChange={inputValue("movie")} >
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
                    <label>Rating</label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      value={rating}
                      onChange={inputValue("rating")}
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
