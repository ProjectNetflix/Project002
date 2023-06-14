import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import './Movie.css'
import Navbar from "./Navbar";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const MySwal = withReactContent(Swal);

const Movie = () => {

    const [word, setWord] = useState("");
    const [movie, setMovie] = useState([]);
    const [dataFilter] = useState(["name", "synopsis"])
    const [search, setSearch] = useState([]);

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

    }

    const searchMovies = (search) => {
        return search.filter((item) => {
            return dataFilter.some((filter) => {
                if (item[filter]) { // ตรวจสอบค่าว่าง
                    return item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1;
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
                    console.log(data, "Playlist User");
                    setMovie(data);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการรับข้อมูล Playlist");
            });
    };

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

    const SaveMovie = (e, title, synopsis, img, title_type, netflix_id, title_date, year) => {
        e.preventDefault();
        const updatedMovie = {
            name: title,
            synopsis: synopsis,
            pic: img,
            title_type: title_type,
            netflix_id: netflix_id,
            title_date: title_date,
            year: year,
        };
        setState(updatedMovie);
        console.log(state);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(updatedMovie),
        };

        fetch("http://localhost:5000/movies", requestOptions)
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
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    useEffect(() => {
        //GetMovie();
        GetMovies();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container">
                <br />
                <h2>Movie</h2>

                <form className="grid align-items-center col-4 p-3" >
                    <input className=" form-control" placeholder="Search for Movie ... " onChange={handleChange} value={word} />
                </form>

                <div className="row card-group">
                    {searchMovies(movie).map((item) => {
                        return (
                            <div className="col" key={item.netflix_id}>
                                <div className="card">
                                    <div className="card-body">
                                        <img
                                            src={item.pic}
                                            className="card-img-top playlist-image"
                                            alt="Playlist Image"
                                            style={{ height: '250px' }}
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
                                </div>
                            </div>
                        )

                    })}
                </div>

            </div>
        </div>
    )
}



export default Movie;