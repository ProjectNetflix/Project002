import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const EditProfile = (props) => {
    const [playlist, setPlaylist] = useState([]);
    const [userData, setUserData] = useState([]);
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const [success, setSuccess] = useState(Boolean);

    const [state, setState] = useState({
        pic: "",
        fname: "",
        lname: "",
    })

    const { pic, fname, lname } = state;

    const inputValue = (name) => (event) => {
        if (name === "pic") {
            setState({ ...state, [name]: event.target.files[0] });
        } else {
            setState({ ...state, [name]: event.target.value });
        }
    };
    const getUser = async () => {
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
                    setUserData(data.data);
                    setFollower(data.data.follower);
                    setFollowing(data.data.following);
                    setState({
                        ...state,

                        fname: data.data.fname,
                        lname: data.data.lname,

                    });
                }
            });
    };

    const EditUserData = (e) => {
        e.preventDefault();
        let uid = localStorage.getItem("userId");
        console.log(state.pic)

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
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setSuccess(true);
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

    useEffect(() => {
        getUser();
    }, [success]);


    return (
        <div>
            <button
                className="btn btn-outline-warning mt-3"
                data-bs-toggle="modal"
                data-bs-target="#EditUser"
            >
                Edit Profile
            </button>
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
                                Edit Profile
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
    )
}
export default EditProfile;