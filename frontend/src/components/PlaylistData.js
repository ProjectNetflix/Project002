import Navbar from "./Navbar";
import "./Playlist.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import "./PlaylistList.css";
import { TiDeleteOutline } from "react-icons/ti"
import { IconContext } from "react-icons";
const MySwal = withReactContent(Swal);

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [movie, setMovie] = useState([]);
  const location = useLocation();
  const { plid } = location.state;
  const [success ,setSuccess] = useState(false);
  const GetMovie = () => {
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '19e2dd80f0msh032002cd75e523cp148704jsn7542c7e84484',
    //     'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com'
    //   }
    // };
    // fetch('https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=10&order_by=rating&country_list=425', options)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data.results);
    //     setMovie(data.results);
    //   })
    //   .catch(err => console.error(err));
  };

  const [state, setState] = useState({
    title: "",
    desc: "",
    pic: "",
    userId: window.localStorage.getItem("userId"),
  });

  const GetPlaylist = async () => {
    console.log(plid);
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
    fetch(`http://localhost:5000/playlists/${plid}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("check", data);
        if (data) {
          console.log(data, "Playlist User");
          setPlaylist(data);
          setMovie(data.movie);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการรับข้อมูล Playlist");
      });
  };

  const DeleteMovie = (e, movieid) => {
    e.preventDefault();
    console.log(movieid);

    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/removeMovieFromPlaylist/${plid}`, {
          method: "PUT",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
          }, body: JSON.stringify({ movieId: movieid }),
        })

          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data) {
              setSuccess(true);
              MySwal.fire({
                text: "Remove Successful !",
                icon: "success",
                showConfirmButton: true,
              });

            } else {
              MySwal.fire({
                text: "error",
                icon: "error",
                showConfirmButton: true,
              });
            }
          });
      }
    });
  };

  useEffect(() => {
    GetPlaylist();
    //GetMovie();
    setSuccess(false);
  }, [success]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 className="p-3"> {playlist.title} </h2>
        <h4 className="p-3"> {playlist.desc} </h4>
        {playlist.originalOwner && <h4 className="p-3"> Original by: {playlist.originalOwner.fname} {playlist.originalOwner.lname} </h4>}
        {/* <h4 className="p-3"> {playlist.originalOwner} </h4> */}

        <div className="row-12">
          <div className="row card-group ">
            {movie.map((item) => {
              return (
                <div className="col" key={item.netflix_id}>

                  <div className="card">

                    <div className="card-body">
                      <Link to={{ pathname: `/movies/${item._id}`, state: { Movieid: item._id }, }} className="link-no-underline">

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
                      </Link>
                    </div>

                    <div >
                      <button className="btn btn-outline-danger mb-3" onClick={(e) => DeleteMovie(e, item._id)}>
                        Remove
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
