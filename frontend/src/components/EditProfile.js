import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IconContext } from "react-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";

const MySwal = withReactContent(Swal);

const EditProfile = (props) => {

    const [playlist, setPlaylist] = useState([]);
    const [userData, setUserData] = useState([]);
    const [follower, setFollower] = useState([]);
    const [fav, setFav] = useState([]);
    const [following, setFollowing] = useState([]);
    const DefaultPic = "https://xn--72czjvzci0ftdsfvb.com/images/2022/12/22/xn--72czjvzci0ftdsfvb.com_f9cb000afb0aeb014f735bcfd3551282.png";

    const [state, setState] = useState({
        pic: "",
        fname: "",
        lname: "",
    });

    const { pic, fname, lname } = state;

    const inputValue = (name) => (event) => {
        if (name === "pic") {
            setState({ ...state, [name]: event.target.files[0] });
        } else {
            setState({ ...state, [name]: event.target.value });
        }
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
                    // console.log(data.data);
                    setUserData(data.data);
                    setFollower(data.data.follower);
                    setFollowing(data.data.following);
                    setFav(data.data.likesMovies);
                    setState({
                        ...state,
                        fname: data.data.fname,
                        lname: data.data.lname,
                    });
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

        fetch(
            `http://localhost:5000/playlists-user/${localStorage.getItem("userId")}`,
            requestOptions
        )
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setPlaylist(data);
                } else {
                    alert(data.status);
                }
            })
            .catch((error) => {
                // console.error(error);
                alert("user error");
            });
    };


    const EditUserData = (e) => {
        e.preventDefault();
        let uid = localStorage.getItem("userId");
        // console.log(state.pic);

        const formData = new FormData();
        formData.append("image", pic);
        formData.append("fname", fname);
        formData.append("lname", lname);

        const requestOptions = {
            method: "PUT",
            body: formData,
        };

        fetch(`http://localhost:5000/updateUser/${uid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    MySwal.fire({
                        text: "Profile updated successfully",
                        // icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    window.location.reload();
                } else {
                    alert(data.status);
                }
            })
            .catch((error) => {
                // console.error(error);
                alert("edit error");
            });
    };

    useEffect(() => {
        GetUser();
        GetPlaylist();
    }, []);

    return (
        <div>
            <div className="user">
                <div className="img-user col ">
                    <div className="info card-body">
                        <img
                            src={userData.imageUrl ? `http://localhost:5000/${userData.imageUrl}` : DefaultPic}
                            className="rounded-circle img-rounded "
                            width={100}
                            height={100}
                        />

                        <div className="info-text">
                            <h4 className="p-2"> {userData.fname} {userData.lname}</h4>
                            <span >Following {following.length} </span>
                            <span >Followers {follower.length} </span>
                            <span >Playlist  {playlist.length}</span>
                            <span >Favorite Movie {fav.length}</span>
                        </div>
                    </div>
                    <button className="btn btn-warning m-3" data-bs-toggle="modal" data-bs-target="#EditUser">
                        Edit Profile
                    </button>
                    <button className="btn btn-dark m-3" data-bs-toggle="modal" data-bs-target="#CreatePlaylist">
                        Create Playlist
                    </button>
                    <button className="btn btn-danger m-3" data-bs-toggle="modal" data-bs-target="#CreatePost">
                        Post Review
                    </button>

                </div>
            </div>

            <div
                className="modal fade"
                id="EditUser"
                tabIndex="-1"
                aria-labelledby="UserModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="UserModalLabel">
                                <IconContext.Provider value={{ color: "orange", size: "30px" }}> <BsFillPersonLinesFill /> Edit Profile
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
                                        <label>Picture</label>
                                        <input
                                            type="file"
                                            className="form-control mt-1"
                                            onChange={inputValue("pic")}
                                        />
                                    </div>

                                    <div className="form-group mt-2">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control mt-1"
                                            value={fname}
                                            onChange={inputValue("fname")}
                                        />
                                    </div>

                                    <div className="form-group mt-2">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control mt-1"
                                            value={lname}
                                            onChange={inputValue("lname")}
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
                                onClick={EditUserData}
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
export default EditProfile;
