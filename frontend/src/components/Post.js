import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Post = () => {

    const [movielist, setMovie] = useState([]);
    const [post, setPost] = useState([]);

    const [state, setState] = useState({
        movie: "",
        content: "",
        owner: localStorage.getItem("userId"),
        rating: "",
    });

    const { movie, content, owner, rating } = state;

    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const handleChangeMovie = (e) => {
        //setPlaylistId(e.target.value);
    };


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
        fetch(`http://localhost:5000/postsmovie/6489d2493b4eed21b7392a0`, requestOptions)

            //fetch(`http://localhost:5000/postsmovie/${6489d2493b4eed21b739c2a0}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setPost(data.data);
                    console.log(data.data);
                } else {
                    alert("Token expired, sign in again");
                }
            });
    };

    const EditPost = (e) => {

        e.preventDefault();
        const formData = new FormData();
        formData.append("content", content);
        formData.append("movie", movie);
        formData.append("owner", owner);
        formData.append("rating", rating);

        const requestOptions = {
            method: "PUT",
            body: formData,
        };

        fetch(`http://localhost:5000/updateUser/`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    MySwal.fire({
                        text: "Profile updated successfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    window.location.reload();
                } else {
                    alert(data.status);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการแก้ไข");
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
                        //window.location.reload();

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
        // GetPost();
        GetMovies();

    }, []);

    return (
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

                                        <select className="custom-select" onChange={inputValue("movie")} >
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
                                            // value={content}
                                            onChange={inputValue("content")}
                                        />
                                    </div>

                                    <div className="form-group mt-2">
                                        <label>Rating</label>
                                        <input
                                            type="text"
                                            className="form-control mt-1"
                                            // value={rating}
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
    );
};
export default Post;
