import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import './Movie.css'
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

        // fetch('https://unogs-unogs-v1.p.rapidapi.com/search/titles?country_list=425&order_by=date&limit=5000&new_date=2021-01-01&subtitle=thai&english&type=movie', options)
        //     .then(response => response.json())
        //     .then(data => {
        //         setMovie(data.results);
        //         console.log(data.results);
        //     })
        //     .catch(err => console.error(err));

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
        getPlaylist()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container">
                <br />
                <h2>Movie</h2>

                <form className="grid align-items-center col-4 p-3" >
                    <input className=" form-control" placeholder="Search for Movie ... "  />
                    {/* <div className="list-group position-absolute  " onChange={handleChange} >
                            {word.length !== 0 && searchFollow(search).map((item, index) => {
                                return (
                                    <Link to={{ pathname:  `/follow/${item._id}`, state: { userid: item._id },}} className=" list-group-item align-items-center " key={index} >{item.fname}  {item.lname}</Link>
                                )
                            })}
                        </div> */}
                </form>

                <div className="row card-group">
                    {movie.map((item) => {
                        return (
                            <div className="col" key={item.netflix_id}>

                                <div className="card">
                                    <div className="card-body">
                                        <img
                                            // src={item.picture}
                                            src={item.pic}
                                            className="card-img-top playlist-image"
                                            alt="Playlist Image"
                                            style={{ height: '150px' }}
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