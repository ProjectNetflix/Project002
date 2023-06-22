import Navbar from "./Navbar";
import "./MovieData.css";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiTwotoneStar } from "react-icons/ai";
import { IconContext } from "react-icons";

const MovieData = () => {

    const location = useLocation();
    const { Movieid } = location.state;
    const [Moviedata, setMoviedata] = useState([]);

    const GetMovie = async () => {

        console.log(Movieid);

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
        fetch(`http://localhost:5000/movie/${Movieid}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log("check", data);
                if (data) {
                    //console.log(data, "Moive");
                    setMoviedata(data);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาด");
            });
    };

    const [post, setPost] = useState([]);
    const GetPost = async () => {
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
        fetch(`http://localhost:5000/postsmovie/${Movieid}`, requestOptions)

            //fetch(`http://localhost:5000/postsmovie/${6489d2493b4eed21b739c2a0}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setPost(data);
                    console.log(data);
                } else {
                    alert("Token expired, sign in again");
                }
            });
    };

    useEffect(() => {
        GetMovie();
        GetPost();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className=" movie ">

                    <div className="img-movie mt-5">
                        <img src={Moviedata.pic} alt="Movie Image" style={{ height: "250px" }} />
                    </div>

                    <div className="movie-info mt-2">
                        <h1>{Moviedata.name}</h1>
                        <p>{Moviedata.synopsis}</p>
                        <IconContext.Provider value={{ color: "yellow", size: "30px" }}> <AiTwotoneStar />  6/10</IconContext.Provider>
                    </div>

                </div>

                {post.map((item) => {
                    return (
                        <div className="col" key={item._id}>
                            <div>
                                <Link to={{ pathname: `/playlist/${item._id}`, state: { plid: item._id }, }} className="link-no-underline" >

                                    <div className="card-body text-black">
                                        <h5 className="card-title">{item.content}</h5>
                                        <p className="card-text">{item.ratng}</p>
                                        <p className="card-text">{item.owner.fname} {item.owner.lname}</p>

                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div >
    )
}

export default MovieData;