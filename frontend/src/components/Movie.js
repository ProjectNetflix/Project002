import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import { BiCameraMovie } from "react-icons/bi";
import { BsHeartFill, BsPlusCircle, BsHeart } from "react-icons/bs";
import "./Movie.css";
import Navbar from "./Navbar";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";


const MySwal = withReactContent(Swal);

const Movie = () => {

  const [userData, setUserData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [word, setWord] = useState("");
  const [movie, setMovie] = useState([]);
  const [dataFilter] = useState(["name", "synopsis"]);
  const [movieId, setMovieId] = useState("");
  const [PlaylistId, setPlaylistId] = useState("");
  const [like, setLike] = useState({});
  const [success, setSuccess] = useState(Boolean);
  const GetMovie = () => {
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': '19e2dd80f0msh032002cd75e523cp148704jsn7542c7e84484',
    //         'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com'
    //     }
    // };
    // fetch('https://unogs-unogs-v1.p.rapidapi.com/search/titles?country_list=425&order_by=date&limit=5000&new_date=2021-01-01&subtitle=thai&english&type=movie', options)
    //     .then(response => response.json())
    //     .then(data => {
    //         setMovie(data.results);
    //         console.log(data.results);
    //     })
    //     .catch(err => console.error(err));
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
          // console.log("joy", data.data);
          setUserData(data.data);
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
          // console.log(data, "Playlist User");
          setPlaylist(data);
        }
      })
      .catch((error) => {
        // console.error(error);
        alert("error to get playlist data");
      });
  };

  const searchMovies = (search) => {
    return search.filter((item) => {
      return dataFilter.some((filter) => {
        if (item[filter]) {
          // ตรวจสอบค่าว่าง
          return (
            item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
          );
        }
      });
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setWord(e.target.value);
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
          // console.log(data, "Playlist User");
          setMovie(data);
        }
      })
      .catch((error) => {
        // console.error(error);
        alert("error to get movie data");
      });
  };

  const handleLikeToggle = (movieId, action) => {
    // โค้ดการส่งคำขอ PUT ไปยังเซิร์ฟเวอร์เพื่อกด like หรือ unlike หนัง
    //const Action = action;
    //const action = like[movieId] ? "unlike" : "like";
    const userId = localStorage.getItem("userId"); // รหัสผู้ใช้

    // console.log(action, movieId);
    fetch(`http://localhost:5000/users/${userId}/movies/${movieId}/${action}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("new", data);
        setSuccess(true);
      })
      .catch((error) => {
        // console.error(error);
      });
  };

  const handleChangePlaylist = (e) => {
    setPlaylistId(e.target.value);
  };

  // const [state, setState] = useState({
  //   name: "",
  //   synopsis: "",
  //   pic: "",
  //   title_type: "",
  //   netflix_id: "",
  //   title_date: "",
  //   year: "",
  // });

  // const { name, synopsis, pic, title_type, netflix_id, title_date, year } = state;

  // const SaveMovie = (e, title, synopsis, img, title_type, netflix_id, title_date, year) => {
  //   e.preventDefault();
  //   const updatedMovie = {
  //     name: title,
  //     synopsis: synopsis,
  //     pic: img,
  //     title_type: title_type,
  //     netflix_id: netflix_id,
  //     title_date: title_date,
  //     year: year,
  //   };
  //   setState(updatedMovie);
  //   console.log(state);

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify(updatedMovie),
  //   };

  //   fetch("http://localhost:5000/movies", requestOptions)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data, "Playlist");
  //       if (data) {
  //         console.log("save");
  //       } else {
  //         MySwal.fire({
  //           text: "Error",
  //           icon: "error",
  //           showConfirmButton: true,
  //           timer: 2000,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  const AddToPL = (e,) => {
    e.preventDefault();
    // console.log(PlaylistId);
    if (PlaylistId === "") {
      MySwal.fire({
        text: "Please choose playlist !!!",
        // icon: "warning",
        showConfirmButton: true,
        timer: 3000,
      });

    } else {
      fetch(`http://localhost:5000/addMovieToPlaylist/${PlaylistId}`, {
        method: "PUT",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
        }
        , body: JSON.stringify({
          movieId: movieId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data, "Playlist");
          if (data.status === "error") {
            MySwal.fire({
              text: "Error",
              // icon: "error",
              showConfirmButton: true,
              //timer: 2000,
            });
          } else {
            setSuccess(true);
            MySwal.fire({
              text: "Success",
              // icon: "success",
              showConfirmButton: true,
              timer: 3000,
            });
            //window.location.reload();

          }
        })
        .catch((error) => {
          // console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    //GetMovie();
    GetPlaylist();
    GetMovies();
    GetUser();
    setSuccess(false);
  }, [success]);

  return (
    <div>
      <Navbar />
      <div className="container">

        <h2 className="p-3" >
          <IconContext.Provider value={{ color: "orange", size: "50px" }}>
            <BiCameraMovie/> <span/> Movie
          </IconContext.Provider></h2>

        <form className="grid align-items-center col-4 p-3">
          <input className=" form-control" placeholder="Search for Movie ... " onChange={handleChange} value={word} />
        </form>

        <div className="row card-group">
          {searchMovies(movie).map((item) => {

            const isLiked = userData.likesMovies.includes(item._id);

            return (
              <div className="col" key={item.netflix_id}>
                <div className="card">
                  <Link
                    to={{
                      pathname: `/movies/${item._id}`,
                      state: { Movieid: item._id },
                    }}
                    className="link-no-underline"
                  >
                    <div className="card-body  d-flex flex-column justify-content-between">
                      <img
                        src={item.pic}
                        className="card-img-top playlist-image"
                        alt="Playlist Image"
                        style={{ height: "250px" }}
                      />

                      <div className="card-title">
                        <h6>{item.name}</h6>
                      </div>

                      <div className="card-text">
                        <p>{item.synopsis}</p>
                        {/* <span>{item.title_type}</span>
                        <span>{item.netflix_id}</span>
                        <span>{item.title_date}</span>
                        <span>{item.year}</span> */}
                      </div>
                    </div>

                  </Link>

                  <div className="mt-auto m-3">

                    {isLiked ? (
                      <button type="button" className="btn" onClick={() => handleLikeToggle(item._id, "unlike")}>
                        <IconContext.Provider value={{ color: "red", size: "20px" }}>
                          <BsHeartFill />
                        </IconContext.Provider>
                      </button>) : (
                      <button type="button" className="btn" onClick={() => handleLikeToggle(item._id, "like")}>
                        <IconContext.Provider value={{ size: "20px" }}>
                          <BsHeart />
                        </IconContext.Provider>
                      </button>)}

                    <button className="btn" data-bs-toggle="modal" data-bs-target="#ATP" onClick={(e) => setMovieId(item._id)}>
                      <IconContext.Provider value={{ color: "black", size: "20px" }}>
                        <BsPlusCircle />
                      </IconContext.Provider>
                    </button>

                  </div>
                </div>

              </div>
            );
          })}

          <div className="modal fade" id="ATP" tabIndex="-1" aria-labelledby="UserModalLabel" aria-hidden="true">
            <div className="modal-dialog justify-content-center">
              <div className="modal-content" >

                <div className="modal-header">
                  <h5 className="modal-title" id="UserModalLabel">Choose Playlist </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <select className="custom-select" onChange={handleChangePlaylist} >
                      <option value="">Choose</option>
                      {playlist.map((playlist) => (
                        <option key={playlist._id} value={playlist._id}>{playlist.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" > Close </button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={AddToPL}> Save </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Movie;
