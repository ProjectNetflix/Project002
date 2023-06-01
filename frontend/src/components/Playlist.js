import { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Playlist = () => {
    const [pic, setPic] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isOpen, setIsOpen] = useState(false); // สถานะเพื่อควบคุมการแสดง/ซ่อน Popup Form

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ดำเนินการตามที่คุณต้องการเมื่อส่งฟอร์ม
        // เช่น เรียกใช้ API, อัปเดตสถานะ, ปิด Popup Form ฯลฯ
        setIsOpen(false);
    };

    const CreatePlaylist = (e) => {

        e.preventDefault();
        const userId = window.localStorage.getItem("userId");
        console.log(title, desc, userId);

        if (title == "") {
            MySwal.fire({
                text: "Please enter data",
                icon: 'error',
                showConfirmButton: true,
                //timer: 2000
            })

        }
        else {
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
                    if (data) {
                        // console.log(data)
                        MySwal.fire({
                            text: 'Success',
                            icon: 'success',
                            showConfirmButton: true,

                        })
                        setDesc("");
                        setTitle("");
                        // alert("successful");
                    } else {

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

    }

    return (
        <div className="container position-relative z-999">
            <button className="btn btn-outline-secondary m-3" onClick={togglePopup}>Create Playlist</button>
            {isOpen && (<div className="container mt-5 p-2 align-items-center justify-content-center ">
                <form className="container w-50 h-50" onSubmit={CreatePlaylist}>
                    <div className="form-content ">
                        <h3>Create Playlist</h3>

                        <div className="form-group mt-3">
                            <label >Picture</label>
                            <input
                                type="file"
                                className="form-control mt-1"
                                placeholder="Search..."
                                onChange={(e) => (setPic(e.target.value))}
                            />
                        </div>

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

                        <div className="m-3 justify-content-start ">
                            <button type="submit" className="btn btn-primary ">
                                Submit
                            </button>

                            <button type="close-button" className="btn btn-warning" onClick={togglePopup} >
                                Cancel
                            </button>
                        </div>

                    </div>
                </form>
            </div>)}

        </div>
    );

}

export default Playlist;