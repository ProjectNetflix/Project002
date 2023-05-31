import { useState } from "react";
import Navbar from "./Navbar";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Playlist = () => {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();
        const userId = window.localStorage.getItem("userId");
        console.log(title, desc, userId);

        fetch("http://localhost:5000/createPlaylist", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                title,
                desc,
                userId: window.localStorage.getItem("userId"),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Playlist");
                if (data.status === "ok") {
                    // console.log(data)
                    MySwal.fire({
                        text: 'Success',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    // alert("successful");
                } else {
                    console.log(JSON.stringify({
                        title,
                        desc,
                        userId: window.localStorage.getItem("userId"),
                    }))
                    MySwal.fire({
                        text: "Error",
                        icon: 'error',
                        showConfirmButton: true,
                        //timer: 2000
                    })

                    // alert(data.status);
                }
            });
    }

    return (
        <div>
            <Navbar />

            <div className="container mt-5 align-items-center justify-content-center ">
                <form className="container w-50 h-50" onSubmit={handleSubmit}>
                    <div className="form-content ">
                        <h3>Create Playlist</h3>

                        <div className="form-group mt-3">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                onChange={(e) => (setTitle(e.target.value))}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>Description</label>
                            <input
                                type="textarea"
                                className="form-control mt-1"
                                onChange={(e) => (setDesc(e.target.value))}
                            />
                        </div>

                        <div className="submit mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Playlist;