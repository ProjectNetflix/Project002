import Navbar from "./Navbar"
import "./Playlist.css"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './PlaylistList.css'
const MySwal = withReactContent(Swal);

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState();
  const [movie, setMovie] = useState([]);


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
  }


  const [state, setState] = useState({
    title: "",
    desc: "",
    pic: "",
    userId: window.localStorage.getItem("userId"),
  });

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
    fetch(`http://localhost:5000/playlists`, requestOptions)
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

  useEffect(() => {
    getPlaylist();
    //GetMovie();

  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h3> Movie </h3>
        <div className="row-12">

          <div className="row card-group " >
            {movie.map((item) => {
              return (
                <div className="col" key={item._id}>

                  <div className="card ">
                    <Link to={`/playlist/${item._id}`} className="link-no-underline" >

                      <div className="card-body">
                        <img
                          src={item.img}
                          className="card-img-top playlist-image"
                          alt="Playlist Image"
                          style={{ height: '150px' }}
                        />

                        <h5 className="card-title text-black">{item.title}</h5>
                        <span className="card-text text-black h-50">{item.synopsis}</span>
                      </div>
                    </Link>

                    {/* <div className="">
                      <button
                        className="btn btn-outline-secondary m-3"
                        data-bs-toggle="modal"
                        data-bs-target="#EditPlaylist"
                        onClick={(e) => CurrentPlaylist(item._id)}
                      >
                        Add
                      </button>
                    </div> */}

                    {/* <button className="btn btn-outline-secondary m-3" data-bs-toggle="modal" data-bs-target="#EditPlaylist" onClick={(e) => CurrentPlaylist(item._id)} >Edit Playlist</button> */}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>

    </div>
  )
}

export default Playlist;
