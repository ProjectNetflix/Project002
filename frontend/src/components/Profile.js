import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PlaylistList from "./PlaylistList";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

const Profile = () => {
  const [pic, setPic] = useState();
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [playlist, setPlaylist] = useState([]);
  const [userData, setUserData] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);

  const EditUserData = () => {
    //e.preventDefault();
    let uid = localStorage.getItem("userId");
    const formData = new FormData();
    //formData.append('image', pic);    
    formData.append('fname', fname);
    formData.append('lname', lname);
    console.log(fname, lname);

    if (lname === "" && fname === "" && pic === "" && uid !== "") {
      MySwal.fire({
        text: "Please enter data",
        icon: 'error',
        showConfirmButton: true,
        timer: 5000,
      })
    }
    else {

      fetch(`http://localhost:5000/updateUser/${uid}`, {
        method: "POST",
        body: {
          formData
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            console.log(data, "UpdateUser");
            alert(data.status);

          } else {
            alert(data.status);
          }
        })
        .catch((error) => {
          console.error(error);
          alert("เกิดข้อผิดพลาดในแก้ไข");
        });
    }

  }
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
        } else {
          alert(data.status);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการรับข้อมูล Playlist");
      });
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
        console.log(data, "userData");
        if (data.data === "token expired") {
          alert("Token expired signin again");
          window.localStorage.clear();
          window.location.href = "./signin";
        } else {
          setUserData(data.data);
          setFollower(data.data.follower);
          setFollowing(data.data.following);

        }
      });
  };


  useEffect(() => {
    getUser();
    getPlaylist();


  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="row-12">
          <div className="col align-items-center p-3">
            <img
              src="https://pbs.twimg.com/media/FBdflFiVkAMsmK2?format=jpg&name=small"
              className="rounded-circle"
              width={100}
              height={100}
            />
            <h4 className=""> {userData.fname} {userData.lname} </h4>
            <span>Following {following.length} </span>
            <span>Followers {follower.length} </span>
            <span>Playlist {playlist.length}</span>
            <span>Favlist Movie 0</span>
            <div>
              <button className="btn btn-outline-warning mt-3" data-bs-toggle="modal" data-bs-target="#EditUser" >Edit Profile</button>
              <PlaylistList />
            </div>


          </div>



          <div className="modal fade" id="EditUser" tabIndex="-1" aria-labelledby="UserModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="UserModalLabel">Edit Profile</h5>
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
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control mt-1"
                          onChange={(e) => setFname(e.target.value)}
                        />
                      </div>

                      <div className="form-group mt-2">
                        <label>Last Name</label>
                        <input
                          type="textarea"
                          className="form-control mt-1"
                          onChange={(e) => setLname(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" onClick={EditUserData} >Save</button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
