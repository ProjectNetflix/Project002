//playlist
import { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Modal } from "react";

const MySwal = withReactContent(Swal);


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
    console.log(title, desc, userId, pic);

    if (title === "") {
      MySwal.fire({
        text: "Please enter data",
        icon: 'error',
        showConfirmButton: true,
      });
    } else {
      const formData = new FormData();
      formData.append('image', pic);
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('userId', userId);

      fetch("http://localhost:5000/createPlaylist", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "Playlist");
          if (data) {
            MySwal.fire({
              text: 'Success',
              icon: 'success',
              showConfirmButton: true,
            });
            setDesc("");
            setTitle("");
            // window.location.reload();
          } else {
            MySwal.fire({
              text: "Error",
              icon: 'error',
              showConfirmButton: true,
            });
          }
        });
    }
  };

  return (
    <div className="container" >
      
      <button className="btn btn-outline-secondary m-3" data-bs-toggle="modal" data-bs-target="#Playlist" >Create Playlist</button>
      <div className="modal fade" id="Playlist" tabIndex="-1" aria-labelledby="PlaylistModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="PlaylistModalLabel">Create Playlist</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form className="container w-100 h-50">
                <div className="form-content ">
                  <div className="form-group mt-2">
                    <label>Picture</label>
                    <input
                      type="file"
                      className="form-control mt-1"
                      placeholder="Search..."
                      onChange={(e) => setPic(e.target.files[0])}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label>Description</label>
                    <input
                      type="textarea"
                      className="form-control mt-1"
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" onClick={CreatePlaylist} >Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
