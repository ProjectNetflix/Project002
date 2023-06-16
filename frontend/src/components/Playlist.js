import Navbar from "./Navbar";
import "./Playlist.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./PlaylistList.css";
const MySwal = withReactContent(Swal);

const Playlist = () => {
  const data = [
    {
      id: 1,
      imageUrl:
        "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",
      title: "Demonslayer",
      desc: "asia",
    },
    {
      id: 2,
      imageUrl:
        "https://images.justwatch.com/poster/269914828/s718/a-business-proposal.%7Bformat%7D",
      title: "Business Proposal",
      desc: "asia",
    },
    {
      id: 3,
      imageUrl:
        "https://puui.wetvinfo.com/vcover_hz_pic/0/w9cphb9w7ev2m931582334936/0",
      title: "Naruto",
      desc: "asia",
    },
    {
      id: 4,
      imageUrl:
        "https://thaipublica.org/wp-content/uploads/2023/03/11-The_Glory.jpg",
      title: "Glory",
      desc: "ซีรีส์จะเล่าเรื่องราวเกี่ยวกับชีวิตของ มุนดงอึน (รับบทโดย ซงฮเยคโย) หญิงสาวคนหนึ่งที่ใฝ่ฝันอยากเป็นสถาปนิก แต่เธอต้องลาออกจากโรงเรียน หลังถูกรังแกและทำร้ายร่างกายอย่างรุนแรงสมัยมัธยมปลาย เธอจึงเฝ้ารอให้คู่กรณีเติบโตขึ้นจนแต่งงานและมีลูก เมื่อลูกของคู่กรณีโตพอที่จะเข้าโรงเรียนประถม เธอก็ได้เข้ามาเป็นคุณครูประจำชั้นของเด็กคนนั้น และเริ่มต้นการแก้แค้น",
    },
  ];

  const [playlist, setPlaylist] = useState(data);
  const [currentPlaylistId, setCurrentPlaylistId] = useState();
  const [movie, setMovie] = useState([]);
  const location = useLocation();
  const { title } = location.state;

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

  const CurrentPlaylist = (playlistId) => {
    setCurrentPlaylistId(playlistId);
    const selectedPlaylist = playlist.find((item) => item._id === playlistId);

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
          //setPlaylist(data);
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
        <h3> {title} </h3>
        <div className="row-12">
          <div className="row card-group ">
            {playlist.map((item) => {
              return (
                <div className="col" key={item._id}>
                  <div className="card ">
                    <Link
                      to={`/playlist/${item._id}`}
                      className="link-no-underline"
                    >
                      <div className="card-body text-black ">
                        <img
                          src={item.imageUrl}
                          // src={`http://localhost:5000/${item.imageUrl}`}
                          className="card-img-top playlist-image"
                          alt="Playlist Image"
                          style={{ height: "150px" }}
                        />

                        <h5 className="card-title text-black">{item.title}</h5>
                        {/* <span className="card-text text-black h-50">{item.synopsis}</span> */}
                        <p className="card-text text-black">{item.desc}</p>
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
  );
};

export default Playlist;
