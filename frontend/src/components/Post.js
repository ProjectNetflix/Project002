import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Post = () => {

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

    const EditUserData = (e) => {
        e.preventDefault();
        let uid = localStorage.getItem("userId");
        console.log(state.pic);

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
        GetPost();
    }, []);

    return (
        <div>
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
                                {" "}
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
    );
};
export default Post;
