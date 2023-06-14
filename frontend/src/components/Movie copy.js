import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import './style.css'
import Navbar from "./Navbar";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const MySwal = withReactContent(Swal);

const Movie = () => {
    const data = [
        {
            id: 1, pic: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",
            name: "Demonslayer",
            synopsis: "asia"
        },
        {
            id: 2, pic: "https://images.justwatch.com/poster/269914828/s718/a-business-proposal.%7Bformat%7D",
            name: "Business Proposal",
            synopsis: "asia"
        },
        {
            id: 3, pic: "https://puui.wetvinfo.com/vcover_hz_pic/0/w9cphb9w7ev2m931582334936/0",
            name: "Naruto",
            synopsis: "asia"
        },
        {
            id: 4, pic: "https://thaipublica.org/wp-content/uploads/2023/03/11-The_Glory.jpg",
            name: "Glory",
            synopsis: "ซีรีส์จะเล่าเรื่องราวเกี่ยวกับชีวิตของ มุนดงอึน (รับบทโดย ซงฮเยคโย) หญิงสาวคนหนึ่งที่ใฝ่ฝันอยากเป็นสถาปนิก แต่เธอต้องลาออกจากโรงเรียน หลังถูกรังแกและทำร้ายร่างกายอย่างรุนแรงสมัยมัธยมปลาย เธอจึงเฝ้ารอให้คู่กรณีเติบโตขึ้นจนแต่งงานและมีลูก เมื่อลูกของคู่กรณีโตพอที่จะเข้าโรงเรียนประถม เธอก็ได้เข้ามาเป็นคุณครูประจำชั้นของเด็กคนนั้น และเริ่มต้นการแก้แค้น"
        }
    ]

    const [countries, setCountries] = useState(data);
    const [word, setWord] = useState("");
    const [movie, setMovie] = useState([]);

    const GetMovie = () => {
        // const options = {
        //     method: 'GET',
        //     headers: {
        //         'X-RapidAPI-Key': '19e2dd80f0msh032002cd75e523cp148704jsn7542c7e84484',
        //         'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com'
        //     }
        // };

        // fetch('https://unogs-unogs-v1.p.rapidapi.com/search/titles?country_list=425&order_by=date&limit=20', options)
        //     .then(response => response.json())
        //     .then(data => {
        //         setMovie(data.results);
        //         console.log(data.results);
        //     })
        //     .catch(err => console.error(err));

    }

    const [state, setState] = useState({
        name: "",
        synopsis: "",
        pic: "",
        title_type: "",
        netflix_id: "",
        title_date: "",
        year: "",
    })

    const { name, synopsis, pic, title_type, netflix_id, title_date, year } = state;

    const [currentPlaylistId, setCurrentPlaylistId] = useState();
    const CurrentPlaylist = (id) => {

        setCurrentPlaylistId(id);
        const selectedPlaylist = movie.find(item => item.netflix_id === id);

        setState({
            ...state,
            name: selectedPlaylist.title,
            synopsis: selectedPlaylist.synopsis,
            pic: selectedPlaylist.img,
            title_type: selectedPlaylist.title_type,
            netflix_id: selectedPlaylist.netflix_id,
            title_date: selectedPlaylist.title_date,
            year: selectedPlaylist.year,

        });

        console.log(state);
    };


    const SaveMovie = (e) => {
        e.preventDefault();
        // const updatedMovie = {
        //     name: title,
        //     synopsis: synopsis,
        //     pic: img,
        //     title_type: title_type,
        //     netflix_id: netflix_id,
        //     title_date: title_date,
        //     year: year,
        // };
        //setState(updatedMovie);
        console.log(state);

        const requestOptions = {
            method: "POST",
            // crossDomain: true,
            // headers: {
            //     "Content-Type": "application/json",
            //     Accept: "application/json",
            //     "Access-Control-Allow-Origin": "*",
            //     Authorization: `Bearer ${localStorage.getItem("token")}`,
            // },
            //body : state,
            body: JSON.stringify({
                name: state.name,
                synopsis: state.synopsis,
                pic: state.pic,
                title_type: state.title_type,
                netflix_id: state.netflix_id,
                title_date: state.title_date,
                year: state.year,
            }),
        };
        console.log("test");

        if (true) {
            fetch("http://localhost:5000/createmovies", requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data, "Playlist");
                    if (data) {
                        console.log("save");

                    } else {
                        MySwal.fire({
                            text: "Error",
                            icon: 'error',
                            showConfirmButton: true,
                            timer: 2000,
                        });
                    }
                }
                )
        }


    }

    useEffect(() => {
        GetMovie();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container">
                <br />
                <h1>รายการภาพยนต์</h1>

                {/* <div className="search-container">
                    <label htmlFor="search-form">
                        <input type="text"
                            className="search-input"
                            placeholder="ค้นหาชื่อเรื่อง"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                    </label>
                </div> */}

                <div className="row card-group">
                    {movie.map((item) => {
                        return (
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <img
                                            // src={item.picture}
                                            src={item.img}
                                            className="card-img-top playlist-image"
                                            alt="Playlist Image"
                                            style={{ height: '150px' }}
                                        />

                                        <div className="card-title">
                                            <h4> name : {item.title}</h4>
                                        </div>

                                        <div className="card-text">
                                            <span>{item.synopsis}</span>
                                            <span>{item.title_type}</span>
                                            <span>{item.netflix_id}</span>
                                            <span>{item.title_date}</span>
                                            <span>{item.year}</span>

                                        </div>

                                    </div>
                                    <button className="btn btn-outline-secondary m-3"
                                        onClick={(e) => setCurrentPlaylistId(e, item.netflix_id)}>save</button>
                                    {/* <button className="btn btn-outline-secondary m-3"
                                        onClick={(e) => SaveMovie(e, item.title, item.synopsis, item.img, item.title_type, item.netflix_id, item.title_date, item.year)}>save</button> */}
                                </div>
                            </div>
                        )

                    })}
                </div>

                <button type="submit" className="btn btn-primary" onClick={(e) => SaveMovie()}>Save</button>

            </div>
        </div>
    )
}



export default Movie;