import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './PlaylistList.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);


const PlaylistList = () => {

  const [playlist, setPlaylist] = useState([]);
  // const [pic, setPic] = useState();
  // const [title, setTitle] = useState();
  // const [desc, setDesc] = useState();

  const [state, setState] = useState({
    title: "",
    desc: "",
    pic: "",
    userId: window.localStorage.getItem("userId"),
  })

  const { title, pic, desc, userId } = state;
  const inputValue = name => event => {
    if (name === "pic") {
      setState({ ...state, [name]: event.target.files[0] });
    }
    else {
      setState({ ...state, [name]: event.target.value });
    }
  }

  const [currentPlaylistId, setCurrentPlaylistId] = useState();
  const CurrentPlaylist = (playlistId) => {

    setCurrentPlaylistId(playlistId);
    const selectedPlaylist = playlist.find(item => item._id === playlistId);

    setState({
      ...state,
      desc: selectedPlaylist.desc,
      title: selectedPlaylist.title,
      pic: selectedPlaylist.imageUrl,
    });

    console.log(state);
  };

  const getPlaylist = async () => {
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
    fetch(`http://localhost:5000/playlists-user/${localStorage.getItem("userId")}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data, "Playlist User");
          setPlaylist(data);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการรับข้อมูล Playlist");
      });
  };

  const CreatePlaylist = (e) => {
    e.preventDefault();
    const userId = window.localStorage.getItem("userId");
    console.log(title, desc, userId, pic);
    // console.log(pic.name)

    const formData = new FormData();
    formData.append('image', pic);
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('userId', userId);
    //console.log("state", formData);

    if (title === "" || userId === "" || pic === "") {
      MySwal.fire({
        text: "Please enter data",
        icon: 'warning',
        showConfirmButton: true,
        timer: 5000,

      });

    } else {

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
              showConfirmButton: false,
              timer: 50000,
            });
            window.location.reload();


          } else {
            MySwal.fire({
              text: "Error",
              icon: 'error',
              showConfirmButton: true,
              timer: 5000,
            });
          }
        });
    }
  };

  const DeletePlaylist = (e, playlistId) => {
    e.preventDefault();
    console.log(playlistId)
    const userId = window.localStorage.getItem("userId");
    console.log(title, desc, userId, pic, playlistId);

    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/playlists/${playlistId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.message) {
              MySwal.fire({
                text: 'ลบเพลย์ลิสต์เรียบร้อยแล้ว',
                icon: 'success',
                showConfirmButton: true,
              });
              // getPlaylist(); // ดึงข้อมูลเพลย์ลิสต์อัพเดตหลังจากการลบ
              window.location.reload();
            } else {
              MySwal.fire({
                text: 'error',
                icon: 'error',
                showConfirmButton: true,
              });
            }
          });
      }
    });
  };

  const EditPlaylist = (e, playlistId) => {
    e.preventDefault();
    console.log(playlistId)
    const userId = window.localStorage.getItem("userId");
    console.log(title, desc, userId, pic, playlistId);
    //setCurrentPlaylist(playlistId);

    const formData = new FormData();
    formData.append('image', pic);
    formData.append('title', title);
    formData.append('desc', desc);

    if (title === "" && desc === "" && pic === "" && playlistId !== "") {
      MySwal.fire({
        text: "Please enter data",
        icon: 'error',
        showConfirmButton: true,
        timer: 5000,
      })
    }
    else {

      fetch(`http://localhost:5000/updatePlaylist/${playlistId}`, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "Playlist");
          if (data) {
            MySwal.fire({
              text: 'Edit Success',
              icon: 'success',
              showConfirmButton: false,
              timer: 5000,
            });
            window.location.reload();

          } else {
            MySwal.fire({
              text: "Error",
              icon: 'error',
              showConfirmButton: true,
            });
          }
        });
      console.log(title, desc, userId, playlistId);

    };
  }


  useEffect(() => {
    getPlaylist();

  }, []);

  return (
    <div className="container" >

      <button className="btn btn-outline-secondary m-3" data-bs-toggle="modal" data-bs-target="#CreatePlaylist" >Create Playlist</button>

      <div className="modal fade" id="CreatePlaylist" tabIndex="-1" aria-labelledby="PlaylistModalLabel" aria-hidden="true">
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
                      onChange={inputValue("pic")}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      onChange={inputValue("title")}

                    />
                  </div>

                  <div className="form-group mt-2">
                    <label>Description</label>
                    <textarea
                      type="text"
                      className="form-control mt-1"
                      onChange={inputValue("desc")}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
              <button type="submit" className="btn btn-primary" onClick={CreatePlaylist} >Save</button>
            </div>

          </div>
        </div>
      </div>

      <h5> My Playlist Movie </h5>
      <div className="row card-group " >
        {playlist.map((item) => {
          return (
            <div className="col" key={item._id}>

              <div className="card">
                <Link to={{ pathname: `/playlist/${item._id}`, state: { title: item.title }, }} className="link-no-underline" >

                  <div className="card-body text-black">
                    <img
                      src={`http://localhost:5000/${item.imageUrl}`}
                      className="card-img-top playlist-image"
                      alt="Playlist Image"
                      style={{ height: '200px' }}
                    />

                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.desc}</p>
                  </div>
                </Link>
                <button className="btn btn-outline-secondary m-3" data-bs-toggle="modal" data-bs-target="#EditPlaylist" onClick={(e) => CurrentPlaylist(item._id)} >Edit Playlist</button>
              </div>
            </div>
          );
        })}

        <div className="modal fade" id="EditPlaylist" tabIndex="-1" aria-labelledby="PlaylistModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title" id="PlaylistModalLabel">Edit Playlist</h5>
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
                        onChange={inputValue("pic")}
                      />
                    </div>

                    <div className="form-group mt-2">
                      <label>Title</label>
                      <input
                        type="text"
                        className="form-control mt-1"
                        value={title}
                        onChange={inputValue("title")}
                      />
                    </div>

                    <div className="form-group mt-2">
                      <label>Description</label>
                      <textarea
                        type="text"
                        className="form-control mt-1"
                        value={desc}
                        onChange={inputValue("desc")}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-danger me-auto" data-bs-dismiss="modal" onClick={(e) => DeletePlaylist(e, currentPlaylistId)}>Delete</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => EditPlaylist(e, currentPlaylistId)}>Save</button>
              </div>

            </div>
          </div>
        </div>

      </div>


    </div>
  );
}

export default PlaylistList;
